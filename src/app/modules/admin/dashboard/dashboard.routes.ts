import { Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard.component";
import { getProgramsResolveDashboard } from "./dashboard.resolver";

export default [
    {
        path     : '',
        component: DashboardComponent,
        resolve: {
            programas: getProgramsResolveDashboard
        }
    }
] as Routes;
