import { Routes } from "@angular/router";
import { ProgramsComponent, ProgramsCoreComponent } from "./programs.component";
import { getProgramaDataResolve, getProgramsResolve } from "./programs.resolver";
import { ProgramsListComponent } from "./programs-list/programs-list.component";

export default [
    {
        path: '',
        component: ProgramsCoreComponent,
        children: [
            {
                path: '',
                component: ProgramsComponent,
                resolve: {
                    programs: getProgramsResolve
                }
            },
            {
                path: ':programa',
                component: ProgramsListComponent,
                resolve: {
                    program: getProgramaDataResolve
                }
            }
        ]
    }
] as Routes;
