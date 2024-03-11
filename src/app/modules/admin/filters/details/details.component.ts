import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-details',
  standalone: true,
  templateUrl: './details.component.html',
  imports: [CommonModule, MatButtonModule, MatIconModule, RouterOutlet, RouterLink],
})
export class DetailsComponent {

    constructor(
        private location: Location,
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
    ){

    }

    //-----------------------------------
    // router functions
    //-----------------------------------
    back(): void {
        this.location.back();
    }
}
