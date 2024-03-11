import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { ListComponent } from './list/list.component';
import { FiltersComponent } from '../filters/filters.component';
import { DetailsComponent } from '../filters/details/details.component';
import { DetailsProgramComponent } from './details/details.component';
import { ProgramYearsComponent } from './details/program-years/program-years.component';
import { YearInfoComponent } from './details/year-info/year-info.component';
import { ProgramInfoComponent } from './program-info/program-info.component';
import { getProgramsResolve } from './home.resolver';

export default [
    {
        path     : '',
        component: HomeComponent,
        children: [
            {
                path: '',
                component: ListComponent,
                resolve: {
                    programs: getProgramsResolve
                }
            },
            {
                path: 'ver',
                component: DetailsProgramComponent,
                children: [
                    {
                        path: ':programa',
                        component: ProgramYearsComponent
                    },
                    {
                        path: ':programa/:year',
                        component: YearInfoComponent
                    }
                ]
            },
            {
                path: 'ver/:programa/:year/:chapter',
                component: ProgramInfoComponent
            },
            {
                path: 'filtro',
                component: FiltersComponent,
            },
            {
                path: 'filtro/:id',
                component: DetailsComponent
            }
        ]
    },
] as Routes;
