module MJ.States.Default {
    import PageMetaService = MJ.Services.IPageMetaService;

    class Controller {
        static $inject = ['$scope', '$window', 'pageMeta'];
        constructor($scope: ng.IScope, private $window: ng.IWindowService, pageMeta: PageMetaService) {
            // detect whether a state change happened because the user:
            // 1. used the browser history (back/forward buttons): $stateChangeSuccess happens after $locationChangeSuccess
            // 2. navigated using links on the page: $stateChangeSuccess happens before $locationChangeSuccess
            // this is necessary because when using browser history the page should scroll to the last position,
            // but when following links it should always take the user to the top of the page.
            // Note: this is quite hacky as it is relying on the internal behavior of angular, perhaps it is cleaner to do it using window.onpopstate
            let lastNavigationEvent = 0;
            let scrollPos = 0;

            $scope.$on('$stateChangeStart', () => {
                lastNavigationEvent = 0;
                pageMeta.setTitle(null);
                scrollPos = $window.pageYOffset;

                // disable auto scrolling by the browser, once the browser scrolls the page immediately reset to the right position
                $window.onscroll = () => {
                    $window.scrollTo(0, scrollPos);
                    $window.onscroll = null;
                };
            });
            $scope.$on(
                '$stateChangeSuccess',
                (event: ng.IAngularEvent, toState: ng.ui.IState, toParams: any, fromState: ng.ui.IState, fromParams: any) => {
                    $window.onscroll = null;
                    if (fromState.name) {
                        // as we change view the fromState view will become position: fixed, so we need to offset its top by the
                        // current scroll position so that it remains in place. This is because the scroll position will soon
                        // change to that of the toState and we don't want the old view to be affected by that during the animation
                        $('.ui-view-animate').css('top', -scrollPos);

                        if (fromState.name === 'default.blog') {
                            // save data for the fromState so that we can use it if the user goes back to this state later on
                            if (!fromState.data)
                                fromState.data = {};

                            const key = this.getDataKey(fromParams);
                            fromState.data[key] = { scrollY: scrollPos };
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

        private chooseAnimation(toState: ng.ui.IState, toParams: any, fromState: ng.ui.IState, fromParams: any) {
            const order: {[key: string]: number} = {
                'default.intro'    : 0,
                'default.home'     : 1,
                'default.blogs'    : 2,
                'default.blog'     : 3,
                'default.notFound' : 4
            };

            if (toState.name === 'default.blog' && fromState.name === 'default.blog') {
                if (toParams.articleId < fromParams.articleId) {
                    return { enter: 'view-slide-right', leave: 'view-slide-left' };
                } else {
                    return { enter: 'view-slide-left', leave: 'view-slide-right' };
                }
            }
            else {
                if (order[toState.name] < order[fromState.name]) {
                    return { enter: 'view-slide-down', leave: 'view-slide-up' };
                }
                else {
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
                'top': -y,
                'position': 'absolute',
                'width': '100%'
            });

            let viewAnimData = $('.ui-view-animate').filter(index => index === 0).data('$uiViewAnim');
            viewAnimData.$animEnter.then(() => {
                $('.ui-view-animate-container').css({
                    'height': '',
                    'overflow': ''
                });
                innerArticle.css({
                    'top': '',
                    'position': '',
                    'width': ''
                });
                this.$window.scrollTo(0, y);
            });
        }
    }

    export var view = {
        templateUrl: 'states/default/default-layout.html',
        controller: Controller,
        controllerAs: 'layoutCtrl'
    };
}
