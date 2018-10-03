import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OverviewComponent } from './overview/overview.component';
import { ArticleComponent } from './article/article.component';

const routes: Routes = [
    { path: 'blog', component: OverviewComponent },
    { path: 'blog/:id', component: ArticleComponent }
];

@NgModule({
    imports: [ RouterModule.forChild(routes) ],
    exports: [ RouterModule ]
})
export class BlogRoutingModule {}
