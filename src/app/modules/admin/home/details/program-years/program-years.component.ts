import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { HomeProgramService } from '../../home.service';

@Component({
  selector: 'app-program-years',
  standalone: true,
  templateUrl: './program-years.component.html',
  imports: [CommonModule, MatIconModule, MatButtonModule, RouterOutlet, RouterLink, NgIf],
})
export class ProgramYearsComponent implements OnInit{

    constructor(
        private _programService: HomeProgramService,
        private route: ActivatedRoute
    ){
        _programService.yearSelected = '';
    }

    ngOnInit(): void {
        this._programService.yearSelected = '';
        this._programService.routeBack = `/programas`;
    }

    setyear(year:any):void{
        this._programService.yearSelected = year;
    }
}
