
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot, Router } from "@angular/router";
import { inject } from "@angular/core";
import { DashboardServiceComponent } from "./dashboard.service";

export const getProgramsResolveDashboard: ResolveFn<any> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    let page:any = '1';
    if(route.queryParamMap.has('page')){
       page = route.queryParamMap.get('page');
    }

    return inject(DashboardServiceComponent).getProgramas(page);
}
