import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeModule } from './home/home.module';
import { BlogModule } from './blog/blog.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { IntroComponent } from './intro/intro.component';
import { PageNotFoundComponent } from './page-not-found.component';

const routes: Routes = [
    { path: '', component: IntroComponent },
    //{ path: 'blog', loadChildren: 'blog/blog.module#BlogModule' },
    //{ path: 'portfolio', loadChildren: 'portfolio/portfolio.module#PortfolioModule' },
    { path: '**', component: PageNotFoundComponent }
];

@NgModule({
    imports: [
        HomeModule,
        BlogModule,
        PortfolioModule,
        RouterModule.forRoot(routes)
    ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {}
