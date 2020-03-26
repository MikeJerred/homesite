import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'app-home-cv',
    templateUrl: './cv.component.html',
    styleUrls: ['./cv.component.scss'],
    animations: [
        trigger('accordion', [
            state('closed', style({ height: 0 })),
            state('open', style({ height: '*' })),
            transition('closed <=> open', animate('0.5s ease-in-out'))
        ])
    ]
})
export class CvComponent {
    private furthestScroll = 0;
    topOpen = false;
    middleOpen = false;
    bottomOpen = false;

    constructor(
        @Inject('Window') private window: Window,
        private elementRef: ElementRef<HTMLElement>) {
    }

    public hasScrolledPast(): boolean {
        return this.furthestScroll > this.elementRef.nativeElement.offsetTop;
    }

    @HostListener('window:scroll')
    onScroll(): void {
        const scroll = this.window.pageYOffset + this.window.innerHeight;

        if (this.furthestScroll < scroll)
            this.furthestScroll = scroll;
    }
}
