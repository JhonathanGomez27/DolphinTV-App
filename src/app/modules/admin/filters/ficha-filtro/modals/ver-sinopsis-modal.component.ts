import { CommonModule, NgFor } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { UserService } from 'app/core/user/user.service';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-ver-sinopsis-modal',
    templateUrl: './ver-sinopsis-modal.component.html',
    standalone: true,
    imports: [
        MatButtonModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        CommonModule,
    ],
})
export class VerSinopsisModalComponent implements OnInit, OnDestroy {

    creditos: any = [];
    nombreFicha: string = '';
    sinopsis: string = '';
    safeSinopsis: any;
    color: string = '#13c00d';
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        public dialogRef: MatDialogRef<VerSinopsisModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _userService: UserService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _domasanitizer: DomSanitizer,
    ) {
        this.creditos = data.creditos;
        this.nombreFicha = data.nombreFicha;
        this.sinopsis = data.sinopsis;
    }

    ngOnInit() {
        this._userService.user$.subscribe((response: any) => {
            this.color = response.color ? response.color : '#13c00d';
            this._changeDetectorRef.markForCheck();
        });

        this.safeSinopsis = this._domasanitizer.bypassSecurityTrustHtml(this.sinopsis);
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    get colorStyles(): any{
        return {'color': this.color};
    }

    get backgroundStyles(): any{
        return {'background-color': this.color, 'color': 'white'};
    }
}
