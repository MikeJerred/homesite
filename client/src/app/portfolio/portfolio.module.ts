import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { PaginationModule } from 'ngx-bootstrap/pagination';

import { SharedModule } from '~/shared/shared.module';
import { PortfolioRoutingModule } from './portfolio-routing.module';
import { ArticleComponent } from './article/article.component';
import { OverviewComponent } from './overview/overview.component';
import { PortfolioService } from './portfolio.service';

@NgModule({
    imports: [
        HttpClientModule,
        PaginationModule.forRoot(),

        SharedModule,
        PortfolioRoutingModule
    ],
    providers: [
        PortfolioService
    ],
    declarations: [
        ArticleComponent,
        OverviewComponent
    ]
})
export class PortfolioModule {}
