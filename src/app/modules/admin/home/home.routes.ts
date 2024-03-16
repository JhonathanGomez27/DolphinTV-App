import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { ListComponent } from './list/list.component';
import { FiltersComponent } from '../filters/filters.component';
import { DetailsComponent } from '../filters/details/details.component';
import { DetailsProgramComponent } from './details/details.component';
import { ProgramYearsComponent } from './details/program-years/program-years.component';
import { YearInfoComponent } from './details/year-info/year-info.component';
import { ProgramInfoComponent } from './program-info/program-info.component';
import { getFichaDataResolve, getProgramDataResolve, getProgramFichasResolve, getProgramsResolve } from './home.resolver';
import { getFichaFilter, getFiltroByProgramaResolve, getProgramaByIdResolve, getSubtituloFilter } from '../filters/filters.resolver';
import { FichaFiltroComponent } from '../filters/ficha-filtro/ficha-filtro.component';

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
                        component: ProgramYearsComponent,
                        resolve: {
                            data: getProgramDataResolve
                        }
                    },
                    {
                        path: ':programa/:year',
                        component: YearInfoComponent,
                        resolve: {
                            data: getProgramDataResolve,
                            fichas: getProgramFichasResolve
                        }
                    }
                ]
            },
            {
                path: 'ver/:programa/:year/:chapter',
                component: ProgramInfoComponent,
                resolve: {
                    ficha: getFichaDataResolve
                }
            },
            {
                path: 'filtro',
                component: FiltersComponent,
            },
            {
                path: 'filtro/:programa',
                component: DetailsComponent,
                resolve: {
                    programaFiltro: getFiltroByProgramaResolve,
                    programa: getProgramaByIdResolve
                }
            },
            {
                path: 'filtro/:programa/:ficha',
                component: FichaFiltroComponent,
                resolve:{
                    fichaInfo: getFichaFilter,
                    subtitulosFicha: getSubtituloFilter
                }
            }
        ]
    },
] as Routes;
