module MJ.Directives.Page.PageFixedToParent {
    // creates an element that has position fixed but takes on the size of its parent element
    angular.module('mj.directives').directive('pageFixedToParent', [
        '$window', '$timeout',
        ($window: ng.IWindowService, $timeout: ng.ITimeoutService) => ({
            restrict: 'E',
            link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attributes: ng.IAttributes) => {
                let parent = element.parent();

                // hack: timeout here to prevent angular reaching 10 digest cycles in release mode.
                // this seems to be to do with the critical html causing the height & width to change rapidly.
                $timeout(() => {
                    scope.$watchGroup(
                        [
                            () => parent.outerHeight(),
                            () => parent.outerWidth()
                        ],
                        (values: number[]) => {
                            element.height(values[0]);
                            element.width(values[1]);
                        });
                }, 300);

                scope.$watch(
                    () => parent[0].getBoundingClientRect().top < ($window.innerHeight + 100)
                        && parent[0].getBoundingClientRect().bottom > -100,
                    (visible) => {
                        if (visible) {
                            element.css('display', 'block');
                        } else {
                            element.css('display', 'none');
                        }
                    }
                );
            },
            template: ''
        })
    ]);
}