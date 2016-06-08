module MJ.States.Default {
    class Controller {
        static $inject = ['$rootScope', '$window', '$timeout'];
        constructor($rootScope: ng.IScope, private $window: ng.IWindowService, private $timeout: ng.ITimeoutService) {
            // detect whether a state change happened because the user:
            // 1. used the browser history (back/forward buttons): $stateChangeSuccess happens after $locationChangeSuccess
            // 2. navigated using links on the page: $stateChangeSuccess happens before $locationChangeSuccess
            // Note: this is quite hacky as it is relying on the internal behaviour of angular,
            // perhaps it is cleaner to do it using window.onpopstate
            let lastNavigationEvent = 0;
            $rootScope.$on('$stateChangeStart', () => {
                lastNavigationEvent = 0;
            });
            $rootScope.$on(
                '$stateChangeSuccess',
                (event: ng.IAngularEvent, toState: ng.ui.IState, toParams: any, fromState: ng.ui.IState, fromParams: any) => {

                    if (lastNavigationEvent === 2)
                        this.browserHistoryNavigate(toState, toParams);

                    lastNavigationEvent = 1;

                    // as we change view the fromState view will become position: fixed, so we need to offset its top by the
                    // current scroll position so that it remains in place. This is because the scroll position will soon
                    // change to that of the toState and we don't want the old view to be affected by that during the animation
                    $('.ui-view-animate').css('top', -$window.scrollY);

                    // save data for the fromState so that we can use it if the user goes back to this state later on
                    if (!fromState.data)
                        fromState.data = {};

                    // we need this key because we might be transitioning to the same state just with different params
                    const key = this.getDataKey(fromParams);

                    fromState.data[key] = {
                        slideTo: fromParams['slideTo'],
                        scrollY: $window.scrollY
                    };
                }
            );
            $rootScope.$on('$locationChangeSuccess', () => {
                if (lastNavigationEvent === 1)
                    this.linkNavigate();

                lastNavigationEvent = 2;
            });
        }

        private getDataKey(fromParams: any) {
            let params = angular.copy(fromParams);
            params.slideTo = undefined;
            return angular.toJson(params);
        }

        private browserHistoryNavigate(toState: ng.ui.IState, toParams: any) {
            if (toState.data) {
                const key = this.getDataKey(toParams);
                const stateData = toState.data[key];

                if (stateData && stateData.slideTo !== undefined) {
                    // slide in the same direction as happened last time this state was visited
                    toParams['slideTo'] = stateData.slideTo;
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
            this.$timeout(() => {
                this.$window.scrollTo(0, y)
            }, 100);
        }
    }

    export var view = {
        templateUrl: 'states/default/default-layout.html',
        controller: Controller,
        controllerAs: 'layoutCtrl'
    };
}