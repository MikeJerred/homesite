import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';

import { HomeModule } from 'home/home.module';
import { PageNotFoundComponent } from './page-not-found.component';

const routes: Routes = [
    { path: '', redirectTo: 'intro', pathMatch: 'full' },
    //{ path: 'blog', loadChildren: 'blog/blog.module#BlogModule' },
    //{ path: 'portfolio', loadChildren: 'portfolio/portfolio.module#PortfolioModule' },
    { path: '**', component: PageNotFoundComponent }
];

@NgModule({
    imports: [
        HomeModule,
        RouterModule.forRoot(routes)
    ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {}