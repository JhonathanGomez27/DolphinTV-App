import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { DashboardServiceComponent } from './dashboard.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  imports: [CommonModule, NgIf, NgFor, RouterLink,],
})
export class DashboardComponent implements OnInit, OnDestroy{

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    //pagination
    page: any = 0;

    programas: any = [];

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private _dashboardService: DashboardServiceComponent,
        private _changeDetectorRef: ChangeDetectorRef
    ){

    }

    ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe(params => {
            if(!params.page){
                this.router.navigate([],{relativeTo: this.activatedRoute,queryParams: { page: '1' }});
                this.page = 1;
            }else{
                this.page = parseInt(params.page) - 1;
            }
            this._changeDetectorRef.markForCheck();
        });

        this._dashboardService.programas.pipe(takeUntil(this._unsubscribeAll)).subscribe((response: any) => {
            this.programas = response.data;
            this._changeDetectorRef.markForCheck();
        });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    getImgRoute(imagen: any): string{
        let image: string = '';
        if(imagen !== null){
            let result = imagen.split("html/")[1];
            image = `http://3.18.149.205/${result}`;
        }else{
            image = "assets/images/dashboard/thumbnail.png";
        }

        return image;
    }
}
