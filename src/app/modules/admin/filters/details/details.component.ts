import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, Location, TitleCasePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { FiltersService } from '../filters.service';
import { Subject, takeUntil } from 'rxjs';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-details',
  standalone: true,
  templateUrl: './details.component.html',
  imports: [CommonModule, MatButtonModule, MatIconModule, RouterOutlet, RouterLink, TitleCasePipe, MatPaginatorModule],
})
export class DetailsComponent implements OnInit, OnDestroy{

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    programa:any = {};

    fichas: any = [];

    tags: any = [];

    page: number = 0;
    totalResultados: number = 0;
    params: any = {};

    constructor(
        private location: Location,
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _filtersService: FiltersService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
    ){

    }

    ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe(params => {
            this.params = params;
            for (const [key, value] of Object.entries(params)) {
                if(key !== 'page'){
                    this.tags.push(value);
                }
            }
            this._changeDetectorRef.markForCheck();
        });

        this._filtersService.programa.pipe(takeUntil(this._unsubscribeAll)).subscribe((response: any) => {
            this.programa = response.programa;
            this._changeDetectorRef.markForCheck();
        });

        this._filtersService.filtroResultado.pipe(takeUntil(this._unsubscribeAll)).subscribe((response: any) => {
            this.fichas = response.resultados;
            this.totalResultados = response.total;
            this._changeDetectorRef.markForCheck();
        });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    //-----------------------------------
    // pagination
    //-----------------------------------
    handlePageEnvent(event: PageEvent){
        let pagina: any = event.pageIndex + 1;
        const {criterio, patrimonio, idioma, clasificacion, page, busqueda, ...paramsB} = this.params;
        let datos:any = {};
        let fichaFiltros: any = {};

        for(const [key, value] of Object.entries(paramsB)){
            fichaFiltros[key] = value;
        }

        datos = { fichaFiltros }
        datos.palabraClave = this.params.busqueda;

        this.getDataByProgramaPaginated(pagina, datos);

    }

    getDataByProgramaPaginated(page:any, datos:any){
        this._filtersService.getFiltrosByProgramaPaginated(page, datos, this.programa.clavePrincipal).pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (response:any) => {
                this._filtersService.filtroResultado = response;
            },(error) => {
                console.log(error);
            }
        );
    }

    //-----------------------------------
    // images function
    //-----------------------------------

    getImgRoute(imagen: any): string{
        let image: string = '';
        if(imagen !== null){
            let result = imagen.split("html/")[1];
            image = `http://3.147.140.118/${result}`;
        }else{
            image = "assets/images/dashboard/thumbnail.png";
        }

        return image;
    }

    //-----------------------------------
    // router functions
    //-----------------------------------
    back(): void {
        this.location.back();
    }
}
