import { Component, HostListener, OnDestroy } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { PageLoadedService } from '~/shared/page-loaded/page-loaded.service';

@Component({
    templateUrl: './intro.component.html',
    styleUrls: ['./intro.component.scss'],
    animations: [
        trigger('background', [
            state('false', style({ transform: 'translateX(0) translateY(0) scale(1)' })),
            state('true', style({ transform: 'translateX(-5%) translateY(-5%) scale(1.1)' })),
            transition('false => true', animate('4s ease-in'))
        ]),
        trigger('border', [
            state('false', style({ 'stroke-dashoffset': '*' })),
            state('true', style({ 'stroke-dashoffset': 0 })),
            transition('false => true', animate('0.5s 1.75s ease-in-out'))
        ]),
        trigger('logo', [
            state('false', style({ opacity: 0 })),
            state('true', style({ opacity: 1 })),
            transition('false => true', animate('0.5s 0.25s ease-in-out'))
        ]),
        trigger('heading', [
            state('false', style({ opacity: 0 })),
            state('true', style({ opacity: 1 })),
            transition('false => true', animate('0.5s 1.25s ease-in-out'))
        ])
    ]
})
export class IntroComponent implements OnDestroy {
    private subscription: Subscription;
    private isPageLoaded = false;

    constructor(private router: Router, private pageLoadedService: PageLoadedService) {
        this.subscription = pageLoadedService.pageLoaded$().subscribe(isLoaded => {
            this.isPageLoaded = this.isPageLoaded || isLoaded;
        });
    }

    ngOnDestroy(): void {
        if (this.subscription)
            this.subscription.unsubscribe();
    }

    @HostListener('window:wheel', ['$event'])
    onWheel(event: WheelEvent): void {
        if (event.deltaY > 0)
            this.gotoHome();
    }

    public gotoHome(): void {
        this.router.navigate(['/home']);
    }
}
