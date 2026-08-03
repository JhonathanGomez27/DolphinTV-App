import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { ProgramsService } from "./programs.service";
import { inject } from "@angular/core";

export const getProgramsResolve: ResolveFn<any> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {

    const page = route.queryParamMap.has('page') ? route.queryParamMap.get('page') : '1';

    return inject(ProgramsService).getProgramas(page);
}

export const getProgramaDataResolve: ResolveFn<any> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {

    const programa = route.paramMap.has('programa') ? route.paramMap.get('programa') : '';

    return inject(ProgramsService).getProgramaById(programa);
};
