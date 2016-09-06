module MJ.Directives.Page.Loaded {
    angular.module('mj.directives').directive('pageLoaded', [
        '$timeout',
        ($timeout: ng.ITimeoutService) => ({
            restrict: 'A',
            link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attributes: ng.IAttributes) => {
                let timeout = () => $timeout(
                    () => {
                        if (!$('.ui-view-animate').hasClass('ng-enter')) {
                            element.addClass('page-loaded');
                        } else {
                            timeout();
                        }
                    },
                    50);

                timeout();
            }
        })
    ]);
}