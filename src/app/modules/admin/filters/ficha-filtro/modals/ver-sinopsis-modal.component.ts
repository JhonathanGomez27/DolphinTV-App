import { CommonModule, NgFor } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';

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
export class VerSinopsisModalComponent implements OnInit {

    creditos: any = [];
    nombreFicha: string = '';
    sinopsis: string = '';

    constructor(
        public dialogRef: MatDialogRef<VerSinopsisModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.creditos = data.creditos;
        this.nombreFicha = data.nombreFicha;
        this.sinopsis = data.sinopsis;
    }

    ngOnInit() {}

    onNoClick(): void {
        this.dialogRef.close();
    }
}
