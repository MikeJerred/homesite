module MJ.Directives.Page.LoadDelay {
    interface IScope extends ng.IScope {
        delay: number;
    }

    angular.module('mj.directives').directive('loadDelay', [
        '$timeout',
        ($timeout: ng.ITimeoutService) => ({
            restrict: 'A',
            link: (scope: IScope, element: ng.IAugmentedJQuery, attributes: ng.IAttributes) => {
                $timeout(() => { element.addClass('loaded'); }, scope.delay || 300);
            },
            scope: {
                delay: '@loadDelay',
            }
        })
    ]);
}