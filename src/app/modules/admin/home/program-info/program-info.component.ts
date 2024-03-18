import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { HomeProgramService } from '../home.service';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-program-info',
  standalone: true,
  templateUrl: './program-info.component.html',
  imports: [CommonModule, MatIconModule, MatButtonModule, RouterLink, MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, MatPaginatorModule],
})
export class ProgramInfoComponent implements OnInit, OnDestroy{

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    routeBack: any = '';

    ficha: any = {};
    tags: any = [];
    subtitulos: any = [];
    totalResponse: number = 0;

    page: number = 0;

    //search bar
    searchControl: UntypedFormControl = new UntypedFormControl();
    debounce: number = 1500;
    loading: boolean = false;

    initital: string = 'init';

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private _programService: HomeProgramService,
        private _changeDetectorRef: ChangeDetectorRef
    ){
        this.activatedRoute.params.subscribe((params) => {
            this.routeBack = `/programas/ver/${params.programa}/${params.year}`;
            // this._programService.routeBack = `/programas/ver/${params.programa}/${params.year}`;
        })
    }

    ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe(params => {
            if(params.busqueda && this.initital === 'init'){
                this.searchControl.setValue(params.busqueda)
            }
            this._changeDetectorRef.markForCheck();
        });

        this.initital = 'fin';

        this._programService.ficha.pipe(takeUntil(this._unsubscribeAll)).subscribe((response: any) => {

            this.ficha = response.ficha;
            this.tags = response.tags;

            this._changeDetectorRef.markForCheck();
        });

        this._programService.subtitulos.pipe(takeUntil(this._unsubscribeAll)).subscribe((response: any) => {

            this.subtitulos = response?.subtitulos || [];
            this.totalResponse = response?.totalSubtitulos || 0;

            this._changeDetectorRef.markForCheck();
        });

        // Subscribe to the search field value changes
        this.searchControl.valueChanges.pipe(debounceTime(this.debounce),takeUntil(this._unsubscribeAll)).subscribe((value) =>
        {
            if(value !== ''){

                this.router.navigate([],{relativeTo: this.activatedRoute,queryParams: { busqueda: value }, queryParamsHandling: 'merge'});
                if(!this.loading ){
                    this.buscarData();
                }
                this._changeDetectorRef.markForCheck();
            }else{
                this.router.navigate([],{relativeTo: this.activatedRoute,queryParams: { busqueda: null }, queryParamsHandling: 'merge'});
                this.buscarData();
                this._changeDetectorRef.markForCheck();
            }
        });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    buscarData(){
        this.page = 0;
        let pagina = 1;
        let data: any = {palabraClave: this.searchControl.value || ''};

        this.getSubtitulosPaginated(pagina, data);
        this._changeDetectorRef.markForCheck();
    }

    handlePageEnvent(event: PageEvent){
        this.loading = true;
        this.page = event.pageIndex;
        let pagina = event.pageIndex + 1;
        let data: any = {palabraClave: this.searchControl.value || ''};

        this.getSubtitulosPaginated(pagina, data);

        this._changeDetectorRef.markForCheck();
    }

    getSubtitulosPaginated(page:any, data:any){
        this._programService.getSubTitulosFichaPaginated(page, this.ficha.clavePrincipal, data).pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (response:any) => {
                this._programService.subtitulos = response;
                this.loading = false;
                this._changeDetectorRef.markForCheck();
            },(error) => {
                this.loading = false;
                this._changeDetectorRef.markForCheck();
            }
        );
    }
}
