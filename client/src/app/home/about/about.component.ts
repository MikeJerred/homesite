import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { PageLoadedService } from '~/shared/page-loaded/page-loaded.service';

@Component({
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnDestroy {
    private subscription: Subscription;
    isPageLoaded = false;

    constructor(pageLoadedService: PageLoadedService) {
        this.subscription = pageLoadedService.pageLoaded$().subscribe(isLoaded => {
            this.isPageLoaded = this.isPageLoaded || isLoaded;
        });
    }

    ngOnDestroy(): void {
        if (this.subscription)
            this.subscription.unsubscribe();
    }

    public getYears(): number {
        return new Date().getFullYear() - new Date('2012').getFullYear();
    }
}
