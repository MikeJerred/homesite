import { Component } from '@angular/core';

import { PageLoadedService } from 'shared/page-loaded/page-loaded.service';

@Component({
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss']
})
export class AboutComponent {
    constructor(private pageLoadedService: PageLoadedService) {
    }

    public pageLoaded(): boolean {
        return this.pageLoadedService.isPageLoaded();
    }
}
