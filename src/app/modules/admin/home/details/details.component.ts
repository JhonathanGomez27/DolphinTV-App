import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Data, Params, Router, RouterLink, RouterOutlet } from '@angular/router';
import { Subject, combineLatest, takeUntil } from 'rxjs';
import { HomeProgramService } from '../home.service';

@Component({
  selector: 'app-program-details',
  standalone: true,
  templateUrl: './details.component.html',
  imports: [CommonModule, MatIconModule, MatButtonModule, RouterOutlet, RouterLink, NgIf],
})
export class DetailsProgramComponent implements OnInit, OnDestroy{

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    yearSelected: string = '';

    constructor(
        private route: ActivatedRoute,
        private _programaService: HomeProgramService,
        private router: Router,
        private _changeDetector: ChangeDetectorRef
    ){
    }

    ngOnInit(): void {
        this._programaService.yearSelected.pipe(takeUntil(this._unsubscribeAll)).subscribe((value) => {
            console.log(value, '----');
            this.yearSelected = value;
            this._changeDetector.markForCheck();
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

    locationBack(){
        this.router.navigate([this._programaService.routeBack], {relativeTo: this.route});
    }
}
