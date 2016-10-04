declare var FastClick: any;

module MJ {
    var app = angular.module('mj', [
        'ngAnimate',
        'ngResource',
        'ngSanitize',
        'ngTouch',
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

    // this is disabled for now since there are no sub-views that need a redirect
    // app.run(
    //     ['$rootScope', '$state', '$q', '$injector',
    //     ($rootScope: ng.IRootScopeService,
    //     $state: ng.ui.IStateService,
    //     $q: ng.IQService,
    //     $injector: ng.auto.IInjectorService) => {

    //     // fix for a bug with angular-ui-router see https://github.com/angular-ui/ui-router/issues/1584
    //     $rootScope.$on('$stateChangeStart', (event: ng.IAngularEvent, toState: ng.ui.IState, params: {}) => {
    //         let redirect = toState.redirectTo;
    //         if (redirect) {
    //             if (angular.isString(redirect)) {
    //                 event.preventDefault();
    //                 $state.go(redirect, params);
    //             } else {
    //                 redirect = $injector.invoke(<(string | Function)[]>redirect);

    //                 if (redirect) {
    //                     $q.when(redirect).then(result => {
    //                         event.preventDefault();
    //                         $state.go(result, params);
    //                     });
    //                 }
    //             }
    //         }
    //     });
    // }]);

    app.run(['$templateCache', ($templateCache: ng.ITemplateCacheService) => {
        // fix the uib-accordion so that you can click anywhere in the header to toggle it, not just on the actual text
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

        FastClick.attach(document.body);
    }]);
}

// declare module angular.ui {
//     interface IState {
//         redirectTo?: string|Array<string|Function>;
//     }
// }