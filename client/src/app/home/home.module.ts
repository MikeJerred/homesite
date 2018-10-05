import { NgModule } from '@angular/core';
import { AccordionModule } from 'ngx-bootstrap/accordion';

import { SharedModule } from '~/shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';
import { AboutComponent } from './about/about.component';
import { CvComponent } from './cv/cv.component';
import { OverviewComponent } from './overview/overview.component';

@NgModule({
    imports: [
        AccordionModule.forRoot(),

        SharedModule,
        HomeRoutingModule
    ],
    declarations: [
        AboutComponent,
        CvComponent,
        OverviewComponent
    ]
})
export class HomeModule {}
