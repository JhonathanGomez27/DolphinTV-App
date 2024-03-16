import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { FiltersService } from '../filters.service';
import { FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { query } from '@angular/animations';

@Component({
    selector: 'app-ficha-filtro',
    templateUrl: 'ficha-filtro.component.html',
    standalone: true,
    imports: [CommonModule, RouterOutlet, RouterLink, MatPaginatorModule, MatFormFieldModule, MatInputModule, FormsModule, MatIconModule, MatButtonModule, ReactiveFormsModule],
})

export class FichaFiltroComponent implements OnInit, OnDestroy{

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

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private _filtersService: FiltersService,
        private _changeDetectorRef: ChangeDetectorRef
    ) { }

    ngOnInit() {

        this.activatedRoute.queryParams.subscribe(params => {
            if(params.busqueda){
                this.searchControl.setValue(params.busqueda)
            }
            this._changeDetectorRef.markForCheck();
        });


        this._filtersService.ficha.pipe(takeUntil(this._unsubscribeAll)).subscribe((response: any) => {

            this.ficha = response.ficha;
            this.tags = response.tags;
            this._changeDetectorRef.markForCheck();
        });

        this._filtersService.subtitulos.pipe(takeUntil(this._unsubscribeAll)).subscribe((response: any) => {

            this.subtitulos = response?.subtitulos || [];
            this.totalResponse = response?.totalSubtitulos || 0;

            this._changeDetectorRef.markForCheck();
        });

         // Subscribe to the search field value changes
         this.searchControl.valueChanges.pipe(debounceTime(this.debounce),takeUntil(this._unsubscribeAll)).subscribe((value) =>
         {
            if(!this.loading){
                this.buscarData();
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

    //-----------------------------------
    // pagination
    //-----------------------------------

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
        this._filtersService.getSubTitulosFichaPaginated(page, this.ficha.clavePrincipal, data).pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (response:any) => {
                this._filtersService.subtitulos = response;
                this.loading = false;
                this._changeDetectorRef.markForCheck();
            },(error) => {
                this.loading = false;
                this._changeDetectorRef.markForCheck();
            }
        );
    }
}
