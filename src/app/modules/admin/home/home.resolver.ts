
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot, Router } from "@angular/router";
import { HomeProgramService } from "./home.service";
import { inject } from "@angular/core";

export const getProgramsResolve: ResolveFn<any> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    let page:any = '1';
    if(route.queryParamMap.has('page')){
       page = route.queryParamMap.get('page');
    }

    return inject(HomeProgramService).getProgramas(page);
}
