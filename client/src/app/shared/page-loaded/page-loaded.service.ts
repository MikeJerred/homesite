import { Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable()
export class PageLoadedService {
    private isLoaded = false;

    constructor(router: Router) {
        router.events
            .pipe(filter(evt => evt instanceof NavigationStart))
            .subscribe((evt: NavigationStart) => {
                this.isLoaded = false;
            });
    }

    public isPageLoaded(): boolean {
        return this.isLoaded;
    }

    public setPageLoaded(isLoaded: boolean): void {
        this.isLoaded = isLoaded;
    }
}