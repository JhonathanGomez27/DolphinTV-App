import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf, NgStyle } from '@angular/common';
import { debounceTime, Subject, takeUntil, map } from 'rxjs';
import { environment } from 'environments/environment';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { UserService } from 'app/core/user/user.service';
import { ProgramsService } from './programs.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { FuseCardComponent } from '@fuse/components/card';

@Component({
  selector: 'app-programs',
  standalone: true,
  imports: [MatButtonModule, NgIf, NgFor, NgStyle, RouterLink, MatIconModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatMenuModule, FuseCardComponent],
  templateUrl: './programs.component.html'
})
export class ProgramsComponent implements OnInit, OnDestroy {

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    sortFilter: any = 'Alfabeticamente: Ascendente';

    page: any = 1;
    totalProgramas: any = 0;
    debounce: number = 1500;

    programas: any = [];

        //search bar
    searchControl: UntypedFormControl = new UntypedFormControl();

    loading: boolean = false;

    urlImagenes: string = environment.urlImages;

    color: string = '#13c00d';

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private _programsService: ProgramsService,
        private _changeDetector: ChangeDetectorRef,
        private _userService: UserService,
    ){
    }

    ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe(params => {
            if(!params.page){
                this.router.navigate([],{relativeTo: this.activatedRoute,queryParams: { page: '1' }});
                this.page = 0;
            }else{
                this.page = parseInt(params.page) - 1;
            }
            this._changeDetector.markForCheck();
        });

        this._programsService.programas.pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (response:any) => {
                this.programas = this.orderPrograms(response.data);
                this.totalProgramas = response.total;

                this.loading = false;

                this._changeDetector.markForCheck();
            }
        );

        // Subscribe to the search field value changes
        this.searchControl.valueChanges.pipe(debounceTime(this.debounce),takeUntil(this._unsubscribeAll)).subscribe((value) =>
        {
            if(value !== ''){
                this.router.navigate(['filtros'], {queryParams: {busqueda: value}});
            }

            this._changeDetector.markForCheck();
        });

        this._userService.user$.pipe(takeUntil(this._unsubscribeAll)).subscribe((response: any) => {
            this.color = response.color ? response.color : '#13c00d'
            this._changeDetector.markForCheck();
        });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    //-----------------------------------
    // Public methods
    //-----------------------------------

    sortByOnChange(sort: any, orden: any){
        if(this.loading){
            return;
        }

        this.loading = true;
        this.page = 1;
        this.sortFilter = sort;
        this._programsService.getProgramas(1, orden).pipe(takeUntil(this._unsubscribeAll)).subscribe();
    }

    //-----------------------------------
    // Private methods
    //-----------------------------------

    private orderPrograms(programs: any): void {
        return programs.map((program: any) => {
            let image = ''

            if(program.imagen !== null){
                if(program.imagen.includes('https://') || program.imagen.includes('http://')){
                    image = program.imagen;
                }else{
                    let result = program.imagen.split("html/")[1];
                    image = `${this.urlImagenes}/${result}`;
                }
            }else{
                image = "assets/images/dashboard/thumbnail.png";
            }

            return {
                ...program,
                imagen: image
            }
        });
    }
}

@Component({
    standalone: true,
    selector: 'app-programs-core',
    imports: [CommonModule, RouterOutlet],
    template: '<router-outlet></router-outlet>'
})
export class ProgramsCoreComponent {
}
