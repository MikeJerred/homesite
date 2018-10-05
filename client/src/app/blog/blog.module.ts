import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { PaginationModule } from 'ngx-bootstrap/pagination';

import { SharedModule } from '~/shared/shared.module';
import { BlogRoutingModule } from './blog-routing.module';
import { ArticleComponent } from './article/article.component';
import { OverviewComponent } from './overview/overview.component';
import { BlogService } from './blog.service';

@NgModule({
    imports: [
        HttpClientModule,
        PaginationModule.forRoot(),

        SharedModule,
        BlogRoutingModule
    ],
    providers: [
        BlogService
    ],
    declarations: [
        ArticleComponent,
        OverviewComponent
    ]
})
export class BlogModule {}
