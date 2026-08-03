import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import { BehaviorSubject, catchError, Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ProgramsService {
    // variables url
    private url: string = environment.url;
    private limit: any = environment.pagination;

    private _httpClient = inject(HttpClient);
    private _router = inject(Router);

    private _programas:  BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _programa:  BehaviorSubject<any | null> = new BehaviorSubject(null);

    constructor() {}

    get programas(): Observable<any>{
        return this._programas.asObservable();
    }

    get programa(): Observable<any>{
        return this._programa.asObservable();
    }

    //-----------------------------------
    // public methods
    //-----------------------------------

    getProgramas(page: any, orden: string = 'ASC'): Observable<any> {
        let params = new HttpParams();
        params = params.set('page', page);
        params = params.set('limit', this.limit);
        params = params.set('orden', orden);

        return this._httpClient.get(`${this.url}programas/paginados`, {params}).pipe(
            tap((response) => {
                // console.log(response);
                this._programas.next(response);
            })
        );
    }

    getProgramaById(programa: string): Observable<any> {
        return this._httpClient.get(`${this.url}programas/oneById/${programa}`).pipe(
            tap((response) => {
                // console.log(response);
                this._programa.next(response);
            }), catchError((error) => {
                //return route back /programs
                this._router.navigate(['/programs']);

                return error;
            })
        );
    }
}
