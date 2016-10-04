module MJ.Directives.Page.Loaded {
    angular.module('mj.directives').directive('pageLoaded', [
        '$timeout',
        ($timeout: ng.ITimeoutService) => ({
            restrict: 'A',
            link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attributes: ng.IAttributes) => {
                if ($('.ui-view-animate').length === 1) {
                    $timeout(() => { element.addClass('page-loaded'); }, 400);
                } else {
                    let unwatch = scope.$watch(() => $('.ui-view-animate').hasClass('ng-enter'), inTransition => {
                        if (inTransition) {
                            $timeout(() => { element.addClass('page-loaded'); }, 400);
                            unwatch();
                        }
                    });
                }
            }
        })
    ]);
}