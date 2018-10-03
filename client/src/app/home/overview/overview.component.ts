import { Component, ElementRef, HostListener, Inject } from '@angular/core';

@Component({
    selector: 'app-home-overview',
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.scss']
})
export class OverviewComponent {
    private furthestScroll = 0;

    constructor(
        @Inject('Window') private window: Window,
        private elementRef: ElementRef<HTMLElement>) {
    }

    public hasScrolledPast(): boolean {
        const offset = this.window.innerHeight * 0.3;
        return this.furthestScroll > this.elementRef.nativeElement.offsetTop + offset;
    }

    @HostListener('window:scroll')
    onScroll(): void {
        const scroll = this.window.pageYOffset + this.window.innerHeight;

        if (this.furthestScroll < scroll)
            this.furthestScroll = scroll;
    }
}
