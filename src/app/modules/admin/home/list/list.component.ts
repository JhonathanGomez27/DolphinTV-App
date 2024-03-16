import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FuseDrawerComponent } from '@fuse/components/drawer';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { HomeProgramService } from '../home.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-list',
  standalone: true,
  templateUrl: './list.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatMenuModule, MatCheckboxModule, FuseDrawerComponent, RouterOutlet, RouterLink, NgIf],
})
export class ListComponent implements OnInit, OnDestroy {

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    sortFilter: any = 'Todos';

    page: any = 1;
    totalProgramas: any = 0;

    programas: any = [];

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private _homProgramsService: HomeProgramService
    ){

    }

    ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe(params => {
                if(!params.page){
                    this.router.navigate([],{relativeTo: this.activatedRoute,queryParams: { page: '1' }});
                    this.page = 1;
                }else{
                    this.page = params.page;
                }
            }
        );

        this._homProgramsService.programas.pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (response:any) => {
                this.programas = response.data;
                this.totalProgramas = response.total;
            }
        );
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    getImgRoute(imagen: any): string{
        let image: string = '';
        if(imagen !== null){
            let result = imagen.split("\\");
            image = `${result[result.length - 1]}`;
        }else{
            image = "assets/images/dashboard/thumbnail.png";
        }

        return image;
    }

    //-----------------------------------
    // sort functions
    //-----------------------------------

    sortByOnChange(sort: any){
        this.sortFilter = sort;
    }
}
