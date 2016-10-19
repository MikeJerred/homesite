module MJ.States.Default {
    import PageMetaService = MJ.Services.IPageMetaService;

    class Controller {
        static $inject = ['$scope', '$window'];
        constructor($scope: ng.IScope, private $window: ng.IWindowService) {
            // hide critical html segment, but only once the css has loaded
            // (otherwise we could get unstyled content if the scripts load before the css)
            $('article.critical-path').addClass('hide-critical');

            // detect whether a state change happened because the user:
            // 1. used the browser history (back/forward buttons): $stateChangeSuccess happens after $locationChangeSuccess
            // 2. navigated using links on the page: $stateChangeSuccess happens before $locationChangeSuccess
            // this is necessary because when using browser history the page should scroll to the last position,
            // but when following links it should always take the user to the top of the page.
            // Note: this is quite hacky as it is relying on the internal behavior of angular, perhaps it is cleaner to do it using window.onpopstate
            let lastNavigationEvent = 0;

            // disable auto scrolling by the browser: only works on chrome at the moment
            (<any>history).scrollRestoration = 'manual';
            this.captureScrollPos(true);

            $scope.$on(
                '$stateChangeStart',
                (event: ng.IAngularEvent, toState: ng.ui.IState, toParams: any, fromState: ng.ui.IState, fromParams: any) => {
                    lastNavigationEvent = 0;
                    this.captureScrollPos(false);

                    // disable auto scrolling by the browser: once the browser scrolls the page immediately reset to the right position
                    $window.scrollTo(0, this.scrollPos);
                }
            );
            $scope.$on(
                '$stateChangeSuccess',
                (event: ng.IAngularEvent, toState: ng.ui.IState, toParams: any, fromState: ng.ui.IState, fromParams: any) => {
                    if (fromState.name) {
                        // as we change view the fromState view will become position: fixed, so we need to offset its top by the
                        // current scroll position so that it remains in place. This is because the scroll position will soon
                        // change to 0 since .ui-view-container has height set to 100vh during the transition,  and we don't want
                        // the old view to be affected by that.
                        //$('.ui-view-animate').css('top', -scrollPos);
                        $('.ui-view-animate > article').css({
                            'top' : -this.scrollPos + 'px',
                            'position': 'absolute',
                            'width': '100%'
                        });

                        if (fromState.name === 'default.blog') {
                            // save data for the fromState so that we can use it if the user goes back to this state later on
                            if (!fromState.data)
                                fromState.data = {};

                            const key = this.getDataKey(fromParams);
                            fromState.data[key] = { scrollY: this.scrollPos };
                        }

                        this.setLeaveAnimation(toState, toParams, fromState, fromParams);

                        let historyNavigate = lastNavigationEvent === 2;
                        let unbind = $scope.$on('$viewContentLoaded', () => {
                            this.setEnterAnimation(toState, toParams, fromState, fromParams);
                            if (historyNavigate)
                                this.browserHistoryNavigate(toState, toParams, fromState, fromParams);
                            else
                                this.linkNavigate();

                            unbind();
                        });
                    }

                    lastNavigationEvent = 1;
                }
            );
            $scope.$on('$locationChangeSuccess', () => {
                lastNavigationEvent = 2;
            });
        }

        private scrollPos = 0;

        private captureScrollPos(on: boolean) {
            let self = this;
            this.$window.onscroll = on
                ? () => { self.scrollPos = window.pageYOffset; }
                : null;
        }

        private chooseAnimation(toState: ng.ui.IState, toParams: any, fromState: ng.ui.IState, fromParams: any) {
            const order: {[key: string]: number} = {
                'default.intro'    : 0,
                'default.home'     : 20,
                'default.blogs'    : 21,
                'default.notFound' : 22,
                'default.blog'     : 40
            };

            if (toState.name === 'default.blog' && fromState.name === 'default.blog') {
                if (toParams.articleId < fromParams.articleId) {
                    return { enter: 'view-slide-right', leave: 'view-slide-left' };
                } else {
                    return { enter: 'view-slide-left', leave: 'view-slide-right' };
                }
            }
            else if (Math.abs(order[toState.name] - order[fromState.name]) < 10) {
                if (order[toState.name] < order[fromState.name]) {
                    return { enter: 'view-slide-right', leave: 'view-slide-left' };
                } else {
                    return { enter: 'view-slide-left', leave: 'view-slide-right' };
                }
            }
            else {
                if (order[toState.name] < order[fromState.name]) {
                    return { enter: 'view-slide-down', leave: 'view-slide-up' };
                } else {
                    return { enter: 'view-slide-up', leave: 'view-slide-down' };
                }
            }
        }

        private setEnterAnimation(toState: ng.ui.IState, toParams: any, fromState: ng.ui.IState, fromParams: any) {
            let name = this.chooseAnimation(toState, toParams, fromState, fromParams).enter;
            $('.ui-view-animate').filter(index => index === 0).addClass(name);
        }

        private setLeaveAnimation(toState: ng.ui.IState, toParams: any, fromState: ng.ui.IState, fromParams: any) {
            let name = this.chooseAnimation(toState, toParams, fromState, fromParams).leave;
            let element = $('.ui-view-animate');
            element.removeClass('view-slide-right view-slide-left view-slide-up view-slide-down');
            element.addClass(name);
        }

        private getDataKey(fromParams: any) {
            let params = angular.copy(fromParams);
            return angular.toJson(params);
        }

        private browserHistoryNavigate(toState: ng.ui.IState, toParams: any, fromState: ng.ui.IState, fromParams: any) {
            if (toState.data) {
                const key = this.getDataKey(toParams);
                const stateData = toState.data[key];

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
            $('.ui-view-animate-container').css({
                'height': '100vh',
                'overflow': 'hidden'
            });
            let innerArticle = $('.ui-view-animate > article').filter(index => index === 0);
            innerArticle.css({
                'top': -y + 'px',
                'position': 'absolute',
                'width': '100%'
            });

            let viewAnimData = $('.ui-view-animate').filter(index => index === 0).data('$uiViewAnim');
            viewAnimData.$animEnter.then(() => {
                $('.ui-view-animate-container').css({
                    'height': '',
                    'overflow': ''
                });
                $('.ui-view-animate > article').css({
                    'top': '',
                    'position': '',
                    'width': ''
                });
                this.$window.scrollTo(0, y);
                this.scrollPos = y;
                this.captureScrollPos(true);
            });
        }
    }

    export var view = {
        templateUrl: 'states/default/default-layout.html',
        controller: Controller,
        controllerAs: 'layoutCtrl'
    };
}
