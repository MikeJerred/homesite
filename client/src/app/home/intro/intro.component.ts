import { Component, HostListener, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { PageLoadedService } from '~/shared/page-loaded/page-loaded.service';

@Component({
    templateUrl: './intro.component.html',
    styleUrls: ['./intro.component.scss']
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
