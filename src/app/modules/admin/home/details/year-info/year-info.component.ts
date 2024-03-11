import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { HomeProgramService } from '../../home.service';

@Component({
  selector: 'app-year-info',
  standalone: true,
  templateUrl: './year-info.component.html',
  imports: [CommonModule, RouterOutlet, RouterLink],
})
export class YearInfoComponent implements OnInit{

    constructor(
        private route: ActivatedRoute,
        private _programService: HomeProgramService,
    ){
        this.route.params.subscribe((params) => {
        })
    }

    ngOnInit(): void {

    }
}
