import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { PageLoadedService } from '~/shared/page-loaded/page-loaded.service';

@Component({
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss']
})
export class AboutComponent {
    private subscription: Subscription;
    private isPageLoaded = false;

    constructor(pageLoadedService: PageLoadedService) {
        this.subscription = pageLoadedService.pageLoaded$().subscribe(isLoaded => {
            this.isPageLoaded = this.isPageLoaded || isLoaded;
        });
    }

    ngOnDestroy(): void {
        if (this.subscription)
            this.subscription.unsubscribe();
    }
}
