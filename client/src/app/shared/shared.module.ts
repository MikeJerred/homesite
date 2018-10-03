import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';

import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { MarkdownComponent } from './markdown/markdown.component';
import { PageLoadedService } from './page-loaded/page-loaded.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ScrollToModule.forRoot()
    ],
    declarations: [
        FooterComponent,
        HeaderComponent,
        MarkdownComponent
    ],
    providers: [
        PageLoadedService
    ],
    exports: [
        FooterComponent,
        HeaderComponent,
        MarkdownComponent,

        CommonModule,
        FormsModule,
        RouterModule
    ]
})
export class SharedModule {}