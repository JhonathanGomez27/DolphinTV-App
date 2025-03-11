import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-filter-root',
    imports: [RouterOutlet],
    template: '<router-outlet></router-outlet>',
    standalone: true
})

export class FilterRootComponent implements OnInit {
    constructor() { }

    ngOnInit() { }
}
