import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { HomeProgramService } from '../../home.service';
import { Subject, takeUntil } from 'rxjs';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-year-info',
  standalone: true,
  templateUrl: './year-info.component.html',
  imports: [CommonModule, RouterOutlet, RouterLink, MatPaginatorModule],
})
export class YearInfoComponent implements OnInit{

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    limit: number = environment.pagination;
    page: any = 0;
    totalFichas: any = 0;
    fichas: any = [];

    programa:any = {};
    yearSelected: any = '';

    image: any = '';

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
        });

        this.activatedRoute.params.subscribe((params) => {
            this._programService.routeBack = `/programas/ver/${params.programa}`;
            this._programService.yearSelected = params.year;
            this.yearSelected = params.year;
        })

        this._programService.fichas.pipe(takeUntil(this._unsubscribeAll)).subscribe((response: any) => {
            this.fichas = response.data;
            this.totalFichas = response.total;
            this._changeDetectorRef.markForCheck();
        });

        this._programService.programa.pipe(takeUntil(this._unsubscribeAll)).subscribe((response: any) => {
            this.programa = response.programa;
            if(response.programa.imagen !== null && response.programa.imagen !== ''){
                let path = response.programa.imagen;
                let result = path.split("\\");

                this.image = `${result[result.length - 1]}`;
            }else{
                this.image = "assets/images/dashboard/thumbnail.png";
            }
            this._changeDetectorRef.markForCheck();
        });
    }

    ngOnInit(): void {

    }

    //-----------------------------------
    // paginator
    //-----------------------------------
    handlePageEvent(event: PageEvent){
        let page = event.pageIndex + 1;
        this.getFichasPaginated(page);
    }

    //-----------------------------------
    // functions fichas
    //-----------------------------------

    getFichasPaginated(page:any){
        this._programService.getFichasProgramaPaginated(this.programa.clavePrincipal, this.yearSelected, page).pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (response:any) => {
                this.router.navigate([],{relativeTo: this.activatedRoute,queryParams: { page: page}});
                this._programService.fichas = response;
            },(error) => {
                console.log(error);
            }
        );
    }
}
