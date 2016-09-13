module MJ.States.Default {
    class Controller {
        static $inject = ['$rootScope', '$window', '$timeout'];
        constructor($rootScope: ng.IScope, private $window: ng.IWindowService, private $timeout: ng.ITimeoutService) {
            // detect whether a state change happened because the user:
            // 1. used the browser history (back/forward buttons): $stateChangeSuccess happens after $locationChangeSuccess
            // 2. navigated using links on the page: $stateChangeSuccess happens before $locationChangeSuccess
            // Note: this is quite hacky as it is relying on the internal behavior of angular,
            // perhaps it is cleaner to do it using window.onpopstate
            let lastNavigationEvent = 0;
            $rootScope.$on('$stateChangeStart', () => {
                lastNavigationEvent = 0;
            });
            $rootScope.$on(
                '$stateChangeSuccess',
                (event: ng.IAngularEvent, toState: ng.ui.IState, toParams: any, fromState: ng.ui.IState, fromParams: any) => {
                    if (lastNavigationEvent === 2)
                        this.browserHistoryNavigate(toState, toParams, fromState, fromParams);

                    lastNavigationEvent = 1;

                    // as we change view the fromState view will become position: fixed, so we need to offset its top by the
                    // current scroll position so that it remains in place. This is because the scroll position will soon
                    // change to that of the toState and we don't want the old view to be affected by that during the animation
                    let scrollPos = (fromState.name === 'default.intro')
                        ? 0
                        : $window.scrollY;
                    $('.ui-view-animate').css('top', -scrollPos);

                    let unbind = $rootScope.$on('$viewContentLoaded', () => {
                        this.setAnimations(toState, toParams, fromState, fromParams);
                        unbind();
                    });

                    // save data for the fromState so that we can use it if the user goes back to this state later on
                    if (!fromState.data)
                        fromState.data = {};

                    // we need this key because we might be transitioning to the same state just with different params
                    const key = this.getDataKey(fromParams);

                    fromState.data[key] = {
                        scrollY: scrollPos
                    };
                }
            );
            $rootScope.$on('$locationChangeSuccess', () => {
                if (lastNavigationEvent === 1)
                    this.linkNavigate();

                lastNavigationEvent = 2;
            });
        }

        private setEnterClass(className: string) {
            $('.ui-view-animate > article').filter(index => index === 0).addClass(className);
        }
        private setLeaveClass(className: string) {
            let element = $('.ui-view-animate > article').filter(index => index === 1);
            element.removeClass('view-slide-right view-slide-left view-slide-up view-slide-down');
            element.addClass(className);
        }

        private setAnimations(toState: ng.ui.IState, toParams: any, fromState: ng.ui.IState, fromParams: any) {
            const order: {[key: string]: number} = {
                'default.intro'    : 0,
                'default.home'     : 1,
                'default.blogs'    : 2,
                'default.blog'     : 3,
                'default.notFound' : 4
            };

            if (toState.name === 'default.blog' && fromState.name === 'default.blog') {
                if (toParams.articleId < fromParams.articleId) {
                    this.setEnterClass('view-slide-right');
                    this.setLeaveClass('view-slide-left');
                } else {
                    this.setEnterClass('view-slide-left');
                    this.setLeaveClass('view-slide-right');
                }
            }
            else {
                if (order[toState.name] < order[fromState.name]) {
                    this.setEnterClass('view-slide-down');
                    this.setLeaveClass('view-slide-up');
                }
                else {
                    this.setEnterClass('view-slide-up');
                    this.setLeaveClass('view-slide-down');
                }
            }
        }

        private getDataKey(fromParams: any) {
            let params = angular.copy(fromParams);
            return angular.toJson(params);
        }

        private browserHistoryNavigate(toState: ng.ui.IState, toParams: any, fromState: ng.ui.IState, fromParams: any) {
            if (toState.data) {
                const key = this.getDataKey(toParams);
                const stateData = toState.data[key];

                if (toState.name === 'default.home' || fromState.name === 'default.home') {
                    stateData.scrollY = 0;
                }

                // scroll to last known position, or to the top if we don't know the last position
                this.scrollTo(stateData.scrollY || 0);
            } else {
                // if we don't known the last position, scroll to top
                this.scrollTo(0);
            }
        }

        private linkNavigate() {
            this.scrollTo(0);
        }

        private scrollTo(y: number) {
            this.$timeout(() => { this.$window.scrollTo(0, y); }, 100);
        }
    }

    export var view = {
        templateUrl: 'states/default/default-layout.html',
        controller: Controller,
        controllerAs: 'layoutCtrl'
    };
}