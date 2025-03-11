import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Subject, takeUntil, map } from 'rxjs';
import { DashboardServiceComponent } from './dashboard.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { environment } from 'environments/environment';
import { UserService } from 'app/core/user/user.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  imports: [CommonModule, RouterLink, MatButtonModule],
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit{

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    @ViewChild('carousel') carousel!: ElementRef;
    //pagination
    page: any = 0;

    programas: any = [];
    urlImagenes: string = environment.urlImages;

    color: string = 'bg-primary';

    images: any = [];

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private _dashboardService: DashboardServiceComponent,
        private _changeDetectorRef: ChangeDetectorRef,
        private _userService: UserService,
    ){

    }

    ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe(params => {
            if(!params.page){
                this.router.navigate([],{relativeTo: this.activatedRoute,queryParams: { page: '1' }});
                this.page = 1;
            }else{
                this.page = parseInt(params.page) - 1;
            }
            this._changeDetectorRef.markForCheck();
        });

        this._dashboardService.programas.pipe(takeUntil(this._unsubscribeAll)).subscribe((response: any) => {
            this.programas = response.data;
            this.getProgramasImage(this.programas);
            this._changeDetectorRef.markForCheck();
        });

        this._userService.user$.pipe(takeUntil(this._unsubscribeAll)).subscribe((response: any) => {
            this.color = response.color ? response.color : '#13c00d';
            this._changeDetectorRef.markForCheck();
        });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    ngAfterViewInit() {
        // Autoplay cada 3 segundos
        setInterval(() => {
          this.nextSlide();
        }, 3000);
      }

    getImgRoute(imagen: any): string{
        let image: string = '';

        if(imagen !== null){
            if(imagen.includes('https://') || imagen.includes('http://')){
                image = imagen;
            }else{
                let result = imagen.split("html/")[1];
                image = `${this.urlImagenes}/${result}`;
            }
        }else{
            image = "assets/images/dashboard/thumbnail.png";
        }

        return image;
    }

    getProgramasImage(programas: any): any{
        const images = programas.map((programa: any) => {
            return this.getImgRoute(programa.imagen);
        });

        //order random images
        const randomImages = images.sort(() => Math.random() - 0.5);

        this.images = randomImages;

        // console.log(randomImages);
    }

    get hoverBgColorClass(): string {
        return `hover:bg-[${this.color}]`;
    }

    // Mover al slide anterior
    prevSlide() {
        const carousel = this.carousel.nativeElement;
        const firstSlide = carousel.firstElementChild;
        const slideWidth = firstSlide.offsetWidth;

        // Si estamos en el primer slide, mover al final
        if (carousel.scrollLeft === 0) {
          carousel.scrollTo({
            left: carousel.scrollWidth, // Ir al final
            behavior: 'smooth',
          });
        } else {
          carousel.scrollBy({
            left: -slideWidth,
            behavior: 'smooth',
          });
        }
      }

      // Mover al siguiente slide
      nextSlide() {
        const carousel = this.carousel.nativeElement;
        const firstSlide = carousel.firstElementChild;
        const slideWidth = firstSlide.offsetWidth;

        // Si estamos en el último slide, mover al principio
        if ( carousel.scrollLeft + carousel.offsetWidth >= carousel.scrollWidth - 10) {
          carousel.scrollTo({
            left: 0, // Ir al principio
            behavior: 'smooth',
          });
        } else {
          carousel.scrollBy({
            left: slideWidth,
            behavior: 'smooth',
          });
        }
      }
}
