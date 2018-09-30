import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AboutComponent } from './about/about.component';
import { IntroComponent } from './intro/intro.component';

const routes: Routes = [
    { path: 'intro', component: IntroComponent, data: { animation: 'intro' } },
    { path: 'home', component: AboutComponent, data: { animation: 'home' } }
];

@NgModule({
    imports: [ RouterModule.forChild(routes) ],
    exports: [ RouterModule ]
})
export class HomeRoutingModule {}
