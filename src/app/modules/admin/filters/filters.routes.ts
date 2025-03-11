import { Routes } from "@angular/router";
import { DetailsComponent } from "./details/details.component";
import { FichaFiltroComponent } from "./ficha-filtro/ficha-filtro.component";
import { FiltersComponent } from "./filters.component";
import { getCreditosFichaFilter, getFichaFilter, getFiltroByProgramaResolve, getProgramaByIdResolve, getProgramsFilterResolve, getSubtituloFilter } from "./filters.resolver";
import { FilterRootComponent } from "./filter-root.component";

export default [
    {
        path     : '',
        component: FilterRootComponent,
        children: [
            {
                path: '',
                component: FiltersComponent,
                resolve: {
                    programas: getProgramsFilterResolve
                }
            },
            {
                path: ':programa',
                component: DetailsComponent,
                resolve: {
                    programaFiltro: getFiltroByProgramaResolve,
                    programa: getProgramaByIdResolve
                }
            },
            {
                path: ':programa/:ficha',
                component: FichaFiltroComponent,
                resolve:{
                    fichaInfo: getFichaFilter,
                    subtitulosFicha: getSubtituloFilter,
                    programa: getProgramaByIdResolve,
                    creditos: getCreditosFichaFilter
                }
            }
        ]
    }
] as Routes;
