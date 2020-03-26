import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnDestroy {
    public show = true;
    public expanded = false;
    private intervalInstance: number;
    private inRouteTransition = false;
    private lastScrollOffset: number;

    constructor(
        private router: Router,
        @Inject('Window') private window: Window,
        @Inject(DOCUMENT) private document: Document
    ) {

        router.events
            .pipe(filter(evt => evt instanceof NavigationEnd))
            .subscribe((evt: NavigationEnd) => {
                if (evt.url === '/')
                    this.expanded = false;

                this.inRouteTransition = true;
                setTimeout(() => { this.inRouteTransition = false; }, 400);
            });

        this.intervalInstance = window.setInterval(() => {
            const currentScrollOffset = this.window.scrollY;
            const delta = 40;

            if (!this.inRouteTransition) {
                if (currentScrollOffset === 0
                    || currentScrollOffset < (this.lastScrollOffset - delta)) {

                    // if we scrolled up by more than delta, or are at the top
                    this.show = true;
                } else if (currentScrollOffset > (this.lastScrollOffset + delta)) {

                    // if we scrolled down by more than delta
                    this.show = false;
                }
            }

            this.lastScrollOffset = currentScrollOffset;
        }, 100);
    }

    ngOnDestroy(): void {
        clearInterval(this.intervalInstance);
    }

    public expandClick() {
        if (!this.show && this.expanded) {
            // if the menu is expanded we don't want to hide the whole header before it gets collapsed
            this.show = true;
        }

        this.expanded = !this.expanded;
    }

    public scrollToBottom() {
        this.document.getElementById('page-footer').scrollIntoView({ behavior: 'smooth' });
    }

    public isScrolledToTop(): boolean {
        return this.window.scrollY === 0;
    }

    public shouldHide() {
        return !this.show && !this.expanded;
    }

    public getUrl(): string {
        return this.router.url;
    }
}
