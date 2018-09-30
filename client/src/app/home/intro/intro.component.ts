import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { PageLoadedService } from 'shared/page-loaded/page-loaded.service';

@Component({
    templateUrl: './intro.component.html',
    styleUrls: ['./intro.component.scss']
})
export class IntroComponent {
    constructor(private router: Router, private pageLoadedService: PageLoadedService) {
    }

    @HostListener('window:wheel', ['$event'])
    onWheel(event: WheelEvent): void {
        if (event.deltaY > 0)
            this.gotoHome();
    }

    public gotoHome(): void {
        this.router.navigate(['/home']);
    }

    public pageLoaded(): boolean {
        return this.pageLoadedService.isPageLoaded();
    }
}
