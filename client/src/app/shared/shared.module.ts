import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';

import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { PageLoadedService } from './page-loaded/page-loaded.service';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        ScrollToModule.forRoot()
    ],
    declarations: [
        FooterComponent,
        HeaderComponent
    ],
    providers: [
        PageLoadedService
    ],
    exports: [
        FooterComponent,
        HeaderComponent,

        CommonModule
    ]
})
export class SharedModule {}