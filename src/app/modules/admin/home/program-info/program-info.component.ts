import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { HomeProgramService } from '../home.service';

@Component({
  selector: 'app-program-info',
  standalone: true,
  templateUrl: './program-info.component.html',
  imports: [CommonModule, MatIconModule, MatButtonModule, RouterLink, MatFormFieldModule, MatInputModule, FormsModule],
})
export class ProgramInfoComponent {

    routeBack: any = '';

    constructor(
        private route: ActivatedRoute,
        private _programService: HomeProgramService,
    ){
        this.route.params.subscribe((params) => {
            this.routeBack = `/programas/ver/${params.programa}/${params.year}`;
            // this._programService.routeBack = `/programas/ver/${params.programa}/${params.year}`;
        })
    }
}
