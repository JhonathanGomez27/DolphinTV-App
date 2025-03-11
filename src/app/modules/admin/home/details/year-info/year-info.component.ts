import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { HomeProgramService } from '../../home.service';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { environment } from 'environments/environment';
import { FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormatTextPipe } from 'app/shared/pipes/format-text.pipe';

@Component({
  selector: 'app-year-info',
  standalone: true,
  templateUrl: './year-info.component.html',
  imports: [CommonModule, RouterLink, MatPaginatorModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule, MatMenuModule, MatTooltipModule, FormatTextPipe],
})
export class YearInfoComponent implements OnInit{

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    limit: number = environment.pagination;
    page: any = 0;
    totalFichas: any = 0;
    fichas: any = [];
    debounce: number = 1500;

    programa:any = {};
    yearSelected: any = '';

    image: any = '';

    //search bar
    sortFilter: any = 'Alfabeticamente: Ascendente';
    searchControl: UntypedFormControl = new UntypedFormControl();

    criterio: string = 'alfabetico';
    orden: string = 'ASC'

    loading: boolean = false;

    initial:string = 'init';
    urlImagenes: string = environment.urlImages;

    constructor(
        private activatedRoute: ActivatedRoute,
        private _programService: HomeProgramService,
        private router: Router,
        private _changeDetectorRef: ChangeDetectorRef
    ){
        this.activatedRoute.queryParams.subscribe(params => {
            if(!params.page){
                this.router.navigate([],{relativeTo: this.activatedRoute,queryParams: { page: '1' }});
                this.page = 0;
            }else{
                this.page = parseInt(params.page) - 1;
            }

            if(params.busqueda && this.initial === 'init'){
                this.searchControl.setValue(params.busqueda);
            }
        });

        this.initial = 'fin';

        this.activatedRoute.params.subscribe((params) => {
            this._programService.routeBack = `/programas/ver/${params.programa}`;
            this._programService.yearSelected = params.year;
            this.yearSelected = params.year;
        })

        this._programService.programa.pipe(takeUntil(this._unsubscribeAll)).subscribe((response: any) => {
            this.programa = response.programa;
            if(response.programa.imagen !== null && response.programa.imagen !== ''){
                // let path = response.programa.imagen;

                // let result = path.split("html/")[1];
                // this.image = `${this.urlImagenes}/${result}`;

                let path = response.programa.imagen;
                if(!path.includes('https://') && !path.includes('http://')) {
                    let result = path.split("html/")[1];
                    this.image = `${this.urlImagenes}/${result}`;
                }else{
                    this.image = path;
                }
            }else{
                this.image = "assets/images/dashboard/thumbnail.png";
            }
            this._changeDetectorRef.markForCheck();
        });

        this._programService.fichas.pipe(takeUntil(this._unsubscribeAll)).subscribe((response: any) => {
            this.fichas = this.formatFichas(response.data);
            // console.log(this.fichas);
            this.totalFichas = response.total;
            this._changeDetectorRef.markForCheck();
        });

        // Subscribe to the search field value changes
        this.searchControl.valueChanges.pipe(debounceTime(this.debounce),takeUntil(this._unsubscribeAll)).subscribe((value) =>
        {
            if(this.loading){
                return;
            }

            if(value === ''){
                this.router.navigate([],{relativeTo: this.activatedRoute,queryParams: { busqueda: null }, queryParamsHandling: 'merge'});

                this._changeDetectorRef.markForCheck();
            }
            this.loading = true;
            // this.searchControl.disable();
            this.page = 0;
            this.getFichasPaginated(1, value);

            this._changeDetectorRef.markForCheck();
        });
    }

    ngOnInit(): void {

    }

    //-----------------------------------
    // paginator
    //-----------------------------------
    handlePageEvent(event: PageEvent){
        if(this.loading){
            return;
        }

        this.loading = true;
        let page = event.pageIndex + 1;
        let busqueda = this.searchControl.value || '';
        this.getFichasPaginated(page, busqueda);
    }

    //-----------------------------------
    // functions fichas
    //-----------------------------------

    getFichasPaginated(page:any, busqueda:string){
        this._programService.getFichasProgramaPaginated(this.programa.clavePrincipal, this.yearSelected, page, this.criterio, this.orden, {palabraClave: busqueda}).pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (response:any) => {
                this.router.navigate([],{relativeTo: this.activatedRoute,queryParams: { page: page}});
                this._programService.fichas = response;
                this.router.navigate([],{relativeTo: this.activatedRoute,queryParams: { busqueda: busqueda }, queryParamsHandling: 'merge'});
                // this.searchControl.enable();
                this.loading = false;
                this._changeDetectorRef.markForCheck();
            },(error) => {
                this.loading = false;
                // this.searchControl.enable();
                this._changeDetectorRef.markForCheck();
            }
        );
    }

    //-----------------------------------
    // sort functions
    //-----------------------------------

    sortByOnChange(sort: any, criterio: string, orden: string){
        if(this.loading){
            return;
        }

        this.loading = true;

        this.sortFilter = sort;
        this.criterio = criterio;
        this.orden = orden;

        let page = this.page + 1;
        let busqueda = this.searchControl.value || '';
        this.getFichasPaginated(page, busqueda);
    }


    private formatFichas(fichas: any){
        return fichas.map((ficha:any) => {
            const thumb = ficha.thumbnailUrl;
            return {
                ...ficha,
                thumbnailUrl: thumb ? `${this.urlImagenes}/assets/thumbnails/${ficha.id_programa}/${thumb}` : this.image
            }
        })
    }
}
