import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as Hammer from 'hammerjs';
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

import { SharedModule } from '~/shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IntroComponent } from './intro/intro.component';
import { PageNotFoundComponent } from './page-not-found.component';

export class HammerConfig extends HammerGestureConfig {
    overrides = {
        swipe: { direction: Hammer.DIRECTION_ALL }
    };
}

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,

        SharedModule,
        AppRoutingModule
    ],
    providers: [
        Title,
        { provide: 'Window', useValue: window },
        { provide: HAMMER_GESTURE_CONFIG, useClass: HammerConfig }
    ],
    declarations: [
        AppComponent,
        IntroComponent,
        PageNotFoundComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
