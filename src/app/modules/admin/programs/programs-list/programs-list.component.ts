import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { ProgramsService } from '../programs.service';
import { environment } from 'environments/environment';
import { MatDividerModule } from '@angular/material/divider';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-programs-list',
  standalone: true,
  imports: [MatIconModule, RouterLink, MatButtonModule, MatSidenavModule, CdkScrollable, MatDividerModule, NgFor, RouterOutlet],
  templateUrl: './programs-list.component.html'
})
export class ProgramsListComponent implements OnInit, OnDestroy {

    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    programa: any = {};
    emisiones: any = [];

    totalFichas: number = 0;

    urlImagenes: string = environment.urlImages;

    constructor(
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _programsService: ProgramsService
    ) { }

    ngOnInit(): void {

        this._programsService.programa.pipe(takeUntil(this._unsubscribeAll)).subscribe({
            next: (response:any) => {
                this.programa = response.programa;
                this.emisiones = response.emisionArray;
                this.totalFichas = response.totalFichas;

                this.programa.imagen = this.getImagePrograma(this.programa.imagen);
            },error: (error) => {
                console.log('error', error);
            }
        });

        this._fuseMediaWatcherService.onMediaChange$.pipe(takeUntil(this._unsubscribeAll)).subscribe(({ matchingAliases }) => {
            if(matchingAliases.includes('lg')){
                this.drawerMode = 'side';
                this.drawerOpened = true;
            }else{
                this.drawerMode = 'over';
                this.drawerOpened = false;
            }
        });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    //-----------------------------------
    // public methods
    //-----------------------------------

    //-----------------------------------
    // private methods
    //-----------------------------------

    private getImagePrograma(imagen: string): string {
        let image = ''

        if(imagen !== null){
            if(imagen.includes('https://') || imagen.includes('http://')){
                image = imagen;
            }else{
                let result = imagen.split("html/")[1];
                image = `${this.urlImagenes}/${result}`;
            }
        }else{
            image = "assets/images/dashboard/thumbnail.png";
        }

        return image;
    }

}
