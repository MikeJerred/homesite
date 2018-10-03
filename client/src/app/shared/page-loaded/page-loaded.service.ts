import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class PageLoadedService {
    private loaded = new BehaviorSubject<boolean>(false);

    public pageLoaded$(): Observable<boolean> {
        return this.loaded;
    }

    public setPageLoaded(isLoaded: boolean): void {
        this.loaded.next(isLoaded);
    }
}