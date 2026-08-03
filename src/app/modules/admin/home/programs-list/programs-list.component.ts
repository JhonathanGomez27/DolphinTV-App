import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CdkScrollable } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-programs-list',
  standalone: true,
  imports: [MatIconModule, RouterLink, MatButtonModule, MatSidenavModule, CdkScrollable],
  templateUrl: './programs-list.component.html'
})
export class ProgramsListComponent implements OnInit, OnDestroy {

    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _fuseMediaWatcherService: FuseMediaWatcherService,
    ) { }

    ngOnInit(): void {
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

}
