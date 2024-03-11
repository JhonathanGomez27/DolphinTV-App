import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class HomeProgramService {

    // variables url
    private url: string = environment.url;
    private limit: any = environment.pagination;

    // variables navegacion
    private _routeBack: string = '';
    private _yearSelected: BehaviorSubject<string> = new BehaviorSubject<string>('');

    // cliente http
    private _httpClient = inject(HttpClient);

    // variables datos
    private _programas:  BehaviorSubject<any | null> = new BehaviorSubject(null);

    //-----------------------------------
    // Getter and setter
    //-----------------------------------

    set routeBack(ruta: string){
        this._routeBack = ruta;
    }

    get routeBack(): string{
        return this._routeBack;
    }

    set yearSelected(year: string){
        this._yearSelected.next(year);
    }

    get yearSelected(): Observable<string>{
        return this._yearSelected.asObservable();
    }

    set programas(data: any){
        this._programas.next(data);
    }

    get programas(): Observable<string>{
        return this._programas.asObservable();
    }

    //-----------------------------------
    // programas
    //-----------------------------------
    getProgramas(page: any): Observable<any> {
        let params = new HttpParams();
        params = params.set('page', page);
        params = params.set('limit', this.limit);

        return this._httpClient.get(`${this.url}programas/paginados`, {params}).pipe(
            tap((response) => {
                // console.log(response);
                this._programas.next(response);
            })
        );
    }

    // obtenerTorneosRefresh(): Observable<any> {
    //     return this._httpClient.get(`${this.url}torneos`);
    // }
}
