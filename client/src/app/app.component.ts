import { Component, Inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationStart, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import {
    AnimationEvent, AnimationMetadata,
    animate, animateChild, group, query, style, transition, trigger
} from '@angular/animations';
import { filter } from 'rxjs/operators';

import { PageLoadedService } from '~/shared/page-loaded/page-loaded.service';

const before: AnimationMetadata[] = [
    style({
        position: 'relative',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        overflow: 'hidden'
    }),
    query(
        ':enter, :leave',
        style({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh'
        })),
    query(':enter', style({ 'z-index': 1000, overflow: 'hidden' })),
    query(':leave', style({ 'z-index': 500, overflow: 'visible' })),
    query(
        ':enter > *',
        style({
            position: 'absolute',
            top: '-{{enterScroll}}px',
            width: '100%'
        })),
    query(
        ':leave > *',
        style({
            position: 'absolute',
            top: '-{{leaveScroll}}px',
            width: '100%'
        }))
];

const after: AnimationMetadata[] = [
    // style({
    //     width: '*',
    //     height: '*',
    //     overflow: 'visible'
    // }),
    // query(
    //     ':enter, :leave',
    //     style({
    //         position: '*',
    //         width: '*',
    //         height: '*',
    //         overflow: 'visible'
    //     })),
    // query(':enter > *, :leave > *', style({
    //     position: '*',
    //     top: '*',
    //     width: '*'
    // }))
];

const slideLeft = [
    ...before,
    query(':enter', style({ transform: 'translateX(100vw)' })),
    query(':leave', animateChild()),
    group([
        query(':enter', animate('1s ease-in-out', style({ transform: 'translateX(0)' }))),
        query(':leave', animate('1s ease-in-out', style({ transform: 'translateX(-70vw)'})))
    ]),
    query(':enter', animateChild()),
    ...after
];

const slideRight = [
    ...before,
    query(':enter', style({ transform: 'translateX(-100vw)' })),
    query(':leave', animateChild()),
    group([
        query(':enter', animate('1s ease-in-out', style({ transform: 'translateX(0)' }))),
        query(':leave', animate('1s ease-in-out', style({ transform: 'translateX(70vw)' })))
    ]),
    query(':enter', animateChild()),
    ...after
];

const slideUp = [
    ...before,
    query(':enter', style({ transform: 'translateY(100vh)' })),
    query(':leave', animateChild()),
    group([
        query(':enter', animate('1s ease-in-out', style({ transform: 'translateY(0)' }))),
        query(':leave', animate('1s ease-in-out', style({ transform: 'translateY(-70vh)' })))
    ]),
    query(':enter', animateChild()),
    ...after
];

const slideDown = [
    ...before,
    query(':enter', style({ transform: 'translateY(-100vh)' })),
    query(':leave', animateChild()),
    group([
        query(':enter', animate('1s ease-in-out', style({ transform: 'translateY(0)' }))),
        query(':leave', animate('1s ease-in-out', style({ transform: 'translateY(70vh)' })))
    ]),
    query(':enter', animateChild()),
    ...after
];

const blogRegex = /^blog:(\d+)$/;
const portfolioRegex = /^portfolio:(\d+)$/;

function getDirection(fromState: string, toState: string): 'up' | 'down' | 'left' | 'right' | null {
    if (blogRegex.test(fromState) && portfolioRegex.test(toState)) {
        return 'left';
    } else if (portfolioRegex.test(fromState) && blogRegex.test(toState)) {
        return 'right';
    }

    if (blogRegex.test(fromState) && blogRegex.test(toState)) {
        return blogRegex.exec(fromState)[1] > blogRegex.exec(toState)[1]
            ? 'right'
            : 'left';
    } else if (portfolioRegex.test(fromState) && portfolioRegex.test(toState)) {
        return portfolioRegex.exec(fromState)[1] > portfolioRegex.exec(toState)[1]
            ? 'right'
            : 'left';
    }

    if (blogRegex.test(fromState) || portfolioRegex.test(fromState)) {
        return 'down';
    } else if (blogRegex.test(toState) || portfolioRegex.test(toState)) {
        return 'up';
    }

    return null;
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    animations: [
        trigger('routerAnimation', [
            transition('void <=> *', []),
            transition('null <=> *', []),
            transition('* => intro', slideDown),
            transition('intro => *', slideUp),
            transition('home => blog', slideLeft),
            transition('home => portfolio', slideLeft),
            transition('home => notFound', slideLeft),
            transition('home => *', slideUp),
            transition('blog => home', slideRight),
            transition('blog => portfolio', slideLeft),
            transition('blog => notFound', slideLeft),
            transition('blog => *', slideUp),
            transition('portfolio => home', slideRight),
            transition('portfolio => blog', slideRight),
            transition('portfolio => notFound', slideLeft),
            transition('portfolio => *', slideUp),
            transition('notFound => home', slideRight),
            transition('notFound => blog', slideRight),
            transition('notFound => portfolio', slideRight),
            transition('notFound => *', slideUp),
            transition((fromState, toState) => getDirection(fromState, toState) === 'up', slideUp),
            transition((fromState, toState) => getDirection(fromState, toState) === 'down', slideDown),
            transition((fromState, toState) => getDirection(fromState, toState) === 'left', slideLeft),
            transition((fromState, toState) => getDirection(fromState, toState) === 'right', slideRight),
            transition('* => *', slideLeft)
        ])
    ]
})
export class AppComponent implements OnInit {
    private previousTrigger: 'imperative' | 'popstate' | 'hashchange';
    private previousUrl: string;
    private nextUrl: string;
    private scrollYValues: { [key: string]: number } = {};

    constructor(
        @Inject('Window') private window: Window,
        private router: Router,
        private title: Title,
        private pageLoadedService: PageLoadedService) {

        if ('scrollRestoration' in history)
            history.scrollRestoration = 'manual';

        router.routeReuseStrategy.shouldReuseRoute = () => false;
    }

    ngOnInit(): void {
        this.router.events
            .pipe(filter(evt => evt instanceof NavigationStart))
            .subscribe((evt: NavigationStart) => {
                this.pageLoadedService.setPageLoaded(false);

                this.previousTrigger = evt.navigationTrigger;

                if (this.previousUrl)
                    this.scrollYValues[this.previousUrl] = window.scrollY;
            });

        this.router.events
            .pipe(filter(evt => evt instanceof NavigationEnd))
            .subscribe((evt: NavigationEnd) => {
                this.nextUrl = evt.url;
            });
    }

    public animationStart(event: AnimationEvent): void {
    }

    public animationDone(event: AnimationEvent): void {
        // if (this.previousTrigger === 'popstate') {
        //     this.window.scrollTo(0, this.scrollYValues[this.nextUrl] || 0);
        // }

        const scrollTo = this.previousTrigger === 'popstate'
            ? this.scrollYValues[this.nextUrl] || 0
            : null;

        setTimeout(() => {
            if (scrollTo)
                this.window.scrollTo(0, scrollTo);

            this.pageLoadedService.setPageLoaded(true);
        }, 0);

        this.previousUrl = this.nextUrl;
        this.nextUrl = null;
        this.previousTrigger = null;
    }

    public getRouteTransition(outlet: RouterOutlet): string | { value: string, params: {} } {
        if (outlet && outlet.isActivated && outlet.activatedRoute
            && outlet.activatedRoute.snapshot && outlet.activatedRoute.snapshot.url) {

            let animation = outlet.activatedRoute.snapshot.url.length === 0
                ? 'intro'
                : outlet.activatedRoute.snapshot.url[0].path;

            if (animation === 'blog' || animation === 'portfolio') {
                const id = outlet.activatedRoute.snapshot.paramMap.get('id');
                if (id)
                    animation = `${animation}:${id}`;
            }

            return {
                value: animation,
                params: {
                    enterScroll: this.previousTrigger === 'popstate'
                        ? this.scrollYValues[this.nextUrl] || 0
                        : 0,
                    leaveScroll: this.scrollYValues[this.previousUrl] || 0
                }
            };
        }

        return 'null';
    }
}
