module MJ {
    var app = angular.module('mj', [
        'ngAnimate',
        'ngResource',
        'ngSanitize',
        'hljs',
        'ui.bootstrap',
        'ui.router',
        'LocalStorageModule',
        'mj.dataServices',
        'mj.directives',
        'mj.filters',
        'mj.services',
        'mj.states',
        'mj.templates'
    ]);

    angular.module('mj.dataServices', ['ngResource']);
    angular.module('mj.directives', []);
    angular.module('mj.filters', []);
    angular.module('mj.services', []);
    angular.module('mj.states', ['ui.router']);
    angular.module('mj.templates', []);

    app.run(
        ['$rootScope', '$state', '$q', '$injector', '$window', '$timeout',
        ($rootScope: ng.IRootScopeService,
        $state: ng.ui.IStateService,
        $q: ng.IQService,
        $injector: ng.auto.IInjectorService,
        $window: ng.IWindowService,
        $timeout: ng.ITimeoutService) => {

        // detect whether a state change happened because the user:
        // 1. used the browser history (back/forward buttons): $stateChangeSuccess happens after $locationChangeSuccess
        // 2. navigated using links on the page: $stateChangeSuccess happens before $locationChangeSuccess
        // Note: this is quite hacky as it is relying on the internal behaviour of angular,
        // perhaps it is cleaner to do it using window.onpopstate
        let lastNavigationEvent = 0;
        $rootScope.$on('$stateChangeStart', () => {
            lastNavigationEvent = 0;
        });
        $rootScope.$on('$stateChangeSuccess', (event: ng.IAngularEvent, toState: ng.ui.IState, toParams: any, fromState: ng.ui.IState) => {
            if (lastNavigationEvent === 2) {
                // User navigated via browser history

                if (toState.data && toState.data.scrollY) {
                    // scroll to last known position
                    $('html,body').delay(100).animate({ scrollTop: toState.data.scrollY }, 0);
                } else {
                    // if we don't known the last position, scroll to top
                    $('html,body').delay(100).animate({ scrollTop: 0 }, 0);
                }
            }
            lastNavigationEvent = 1;

            $('.ui-view-animate').css('top', -$window.scrollY);

            if (!fromState.data)
                fromState.data = {};
            fromState.data.scrollY = $window.scrollY;
        });
        $rootScope.$on('$locationChangeSuccess', () => {
            if (lastNavigationEvent === 1) {
                // User navigated via links

                // scroll to top
                $('html,body').delay(100).animate({ scrollTop: 0 }, 0);
            }
            lastNavigationEvent = 2;
        });


        // fix for a bug with angular-ui-router see https://github.com/angular-ui/ui-router/issues/1584
        $rootScope.$on('$stateChangeStart', (event: ng.IAngularEvent, toState: ng.ui.IState, params: {}) => {
            let redirect = toState.redirectTo;
            if (redirect) {
                if (angular.isString(redirect)) {
                    event.preventDefault();
                    $state.go(redirect, params);
                } else {
                    redirect = $injector.invoke(<(string | Function)[]>redirect);

                    if (redirect) {
                        $q.when(redirect).then(result => {
                            event.preventDefault();
                            $state.go(result, params);
                        });
                    }
                }
            }
        });
    }]);

    app.run(['$templateCache', ($templateCache: ng.ITemplateCacheService) => {
        // fix the uib-accordion so that you can click anwhere in the header to toggle it, not just on the actual text
        $templateCache.put("uib/template/accordion/accordion-group.html",
            "<div class=\"panel\" ng-class=\"panelClass || 'panel-default'\">\n" +
            "  <div role=\"tab\" id=\"{{::headingId}}\" aria-selected=\"{{isOpen}}\" class=\"panel-heading\" ng-click=\"toggleOpen()\" ng-keypress=\"toggleOpen($event)\">\n" +
            "    <h4 class=\"panel-title\">\n" +
            "      <a role=\"button\" data-toggle=\"collapse\" href aria-expanded=\"{{isOpen}}\" aria-controls=\"{{::panelId}}\" tabindex=\"0\" class=\"accordion-toggle\" uib-accordion-transclude=\"heading\"><span uib-accordion-header ng-class=\"{'text-muted': isDisabled}\">{{heading}}</span></a>\n" +
            "    </h4>\n" +
            "  </div>\n" +
            "  <div id=\"{{::panelId}}\" aria-labelledby=\"{{::headingId}}\" aria-hidden=\"{{!isOpen}}\" role=\"tabpanel\" class=\"panel-collapse collapse\" uib-collapse=\"!isOpen\">\n" +
            "    <div class=\"panel-body\" ng-transclude></div>\n" +
            "  </div>\n" +
            "</div>\n" +
            "");
    }]);

    app.config(['$httpProvider', ($httpProvider: ng.IHttpProvider) => {
        // combines multiple concurrent requests to run in one digest cycle
        $httpProvider.useApplyAsync(true);
    }]);
}

declare module angular.ui {
    interface IState {
        redirectTo?: string|Array<string|Function>;
    }
}