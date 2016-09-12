module MJ.Directives.Page.Loaded {
    angular.module('mj.directives').directive('pageLoaded', [
        '$timeout',
        ($timeout: ng.ITimeoutService) => ({
            restrict: 'A',
            link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attributes: ng.IAttributes) => {
                let transitionStarted = $('.ui-view-animate').length === 1;
                let unwatch = scope.$watch(() => $('.ui-view-animate').hasClass('ng-enter'), inTransition => {
                    if (!transitionStarted) {
                        if (inTransition)
                            transitionStarted = true;
                    }
                    else if (inTransition === false) {
                        element.addClass('page-loaded');
                        unwatch();
                    }
                });
            }
        })
    ]);
}