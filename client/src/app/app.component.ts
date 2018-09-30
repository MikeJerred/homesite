import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { NavigationStart, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { AnimationEvent, AnimationMetadata, animate, animateChild, group, query, style, transition, trigger } from '@angular/animations';
import { filter } from 'rxjs/operators';

import { PageLoadedService } from 'shared/page-loaded/page-loaded.service';

const setupContainers: AnimationMetadata[] = [
    style({ position: 'relative' }),
    query(':enter', style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        'z-index': 100
    })),
    query(
        ':leave',
        style({
            position: 'absolute',
            top: '-{{leaveScroll}}px',
            left: 0,
            width: '100%'
        }),
        { params: { leaveScroll: 0 } })
];

const slideLeft = setupContainers.concat([
    query(':enter', style({ transform: 'translateX(100vw)' })),
    query(':leave', animateChild()),
    group([
        query(':enter', animate('1s ease-in-out', style({ transform: 'translateX(0)'}))),
        query(':leave', animate('1s ease-in-out', style({ transform: 'translateX(-70vw)'})))
    ]),
    query(':enter', animateChild())
]);

const slideRight: AnimationMetadata[] = [
    query(
        ':leave',
        style({ position: 'fixed', left: 0, width: '100vw', transform: 'translateX(0)' }),
        { optional: true }),
    query(':enter', style({ position: 'absolute', left: 0, width: '100vw', transform: 'translateX(-100vw)', 'z-index': 100 })),
    group([
        query(':leave', animate('1s ease-in-out', style({ transform: 'translateX(70vw)' })), { optional: true }),
        query(':enter', animate('1s ease-in-out', style({ transform: 'translateX(0)' }))),
    ])
];

const slideUp: AnimationMetadata[] = [
    query(
        ':leave',
        style({ position: 'fixed', left: 0, width: '100vw', transform: 'translateY(0)' }),
        { optional: true }),
    query(':enter', style({ position: 'absolute', left: 0, width: '100vw', transform: 'translateY(100vh)', 'z-index': 100 })),
    group([
        query(':leave', animate('1s ease-in-out', style({ transform: 'translateY(-70vh)' })), { optional: true }),
        query(':enter', animate('1s ease-in-out', style({ transform: 'translateY(0)' }))),
    ])
];

const slideDown: AnimationMetadata[] = [
    query(
        ':leave',
        style({ position: 'fixed', left: 0, width: '100vw', transform: 'translateY(0)' }),
        { optional: true }),
    query(':enter', style({ position: 'absolute', left: 0, width: '100vw', transform: 'translateY(-100vh)', 'z-index': 100 })),
    group([
        query(':leave', animate('1s ease-in-out', style({ transform: 'translateY(70vh)' })), { optional: true }),
        query(':enter', animate('1s ease-in-out', style({ transform: 'translateY(0)' }))),
    ])
];

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    animations: [
        trigger('routerAnimation', [
            transition('void => *', []),
            transition('null => *', []),
            transition('* => intro', slideLeft),
            transition('intro => *', slideLeft),
            //transition('* => intro', slideDown),
            //transition('intro => *', slideUp),
            transition('home => blogs', slideLeft),
            transition('home => portfolios', slideLeft),
            transition('home => notFound', slideLeft),
            transition('home => *', slideUp),
            transition('blogs => home', slideRight),
            transition('blogs => portfolios', slideLeft),
            transition('blogs => notFound', slideLeft),
            transition('blogs => *', slideUp),
            transition('portfolios => home', slideRight),
            transition('portfolios => blogs', slideRight),
            transition('portfolios => notFound', slideLeft),
            transition('portfolios => *', slideUp),
            transition('notFound => home', slideRight),
            transition('notFound => blogs', slideRight),
            transition('notFound => portfolios', slideRight),
            transition('notFound => *', slideUp),
            transition('* => home', slideDown),
            transition('* => blogs', slideDown),
            transition('* => portfolios', slideDown),
            transition('* => notFound', slideDown),
            transition('blog-1 => blog-2', slideLeft),
            transition('blog-2 => blog-1', slideRight),

            transition('* => *', slideLeft)
        ])
    ]
})
export class AppComponent {
    private lastPoppedUrl: string;
    private previousUrl: string;
    private scrollYValues: { [key: string]: number } = {};
    private animationDoneQueue: ((event: AnimationEvent) => void)[] = [];

    constructor(
        private router: Router,
        private title: Title,
        private location: Location,
        private pageLoadedService: PageLoadedService) {

        if ('scrollRestoration' in history)
            history.scrollRestoration = 'manual';
    }

    ngOnInit(): void {
        this.location.subscribe(evt => {
            this.lastPoppedUrl = evt.url;
        });

        this.router.events
            .pipe(filter(evt => evt instanceof NavigationStart))
            .subscribe((evt: NavigationStart) => {
                console.log(`NavigationStart: ${evt.url}`);

                // if (this.previousUrl) {
                //     this.scrollYValues[this.previousUrl] = window.scrollY;
                // }
            });

        this.router.events
            .pipe(filter(evt => evt instanceof NavigationEnd))
            .subscribe((evt: NavigationEnd) => {
                console.log(`NavigationEnd: ${evt.url}`);

                // const roots = $('app-root > main > ng-component');
                // const enter = roots.first();
                // const leave = roots.last();

                // leave.css({
                //     top: -this.scrollYValues[this.previousUrl] + 'px'
                // });

                // if (evt.url === this.lastPoppedUrl) {
                //     this.lastPoppedUrl = undefined;

                //     window.scrollTo(0, this.scrollYValues[evt.url]);
                //     this.animationDoneQueue.push(() => {
                //         enter.css({ top: '' });
                //     });
                // } else if (evt.url !== '/home') {
                //     window.scrollTo(0, 0);

                //     this.animationDoneQueue.push(() => {
                //         enter.css({ top: '' });
                //     });
                // }

                // this.previousUrl = evt.url;
            });
    }

    public animationStart(event: AnimationEvent): void {

    }

    public animationDone(event: AnimationEvent): void {
        // this.animationDoneQueue.forEach(func => {
        //     func(event);
        // });

        // this.animationDoneQueue = [];

        this.pageLoadedService.setPageLoaded(true);
    }

    public getRouteTransition(outlet: RouterOutlet): string | { value: string, params: {} } {
        const animation = outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];

        if (animation) {
            return {
                value: animation,
                params: {
                    leaveScroll: 0
                }
            };
        }

        return null;
    }
}
