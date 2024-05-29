import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class DashboardServiceComponent {

    // variables url
    private url: string = environment.url;
    private limit: any = environment.pagination;

    // cliente http
    private _httpClient = inject(HttpClient);

    // variables datos
    private _programas:  BehaviorSubject<any | null> = new BehaviorSubject(null);


    //-----------------------------------
    // Getter and setter
    //-----------------------------------
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
        params = params.set('orden', 'ASC');

        return this._httpClient.get(`${this.url}programas/paginados`, {params}).pipe(
            tap((response) => {
                // console.log(response);
                this._programas.next(response);
            })
        );
    }

}
