import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { HomeProgramService } from '../home.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-program-info',
  standalone: true,
  templateUrl: './program-info.component.html',
  imports: [CommonModule, MatIconModule, MatButtonModule, RouterLink, MatFormFieldModule, MatInputModule, FormsModule],
})
export class ProgramInfoComponent implements OnInit, OnDestroy{

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    routeBack: any = '';

    ficha: any = {};
    tags: any = [];
    subtitulos: any = [];

    constructor(
        private route: ActivatedRoute,
        private _programService: HomeProgramService,
        private _changeDetectorRef: ChangeDetectorRef
    ){
        this.route.params.subscribe((params) => {
            this.routeBack = `/programas/ver/${params.programa}/${params.year}`;
            // this._programService.routeBack = `/programas/ver/${params.programa}/${params.year}`;
        })
    }

    ngOnInit(): void {
        this._programService.ficha.pipe(takeUntil(this._unsubscribeAll)).subscribe((response: any) => {

            this.ficha = response.ficha;
            this.tags = response.tags;
            this.subtitulos = response.subtitulos;

            this._changeDetectorRef.markForCheck();
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
}
