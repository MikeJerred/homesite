module MJ.Directives.Page.PageFixedToParent {
    angular.module('mj.directives').directive('pageFixedToParent', [
        '$window',
        ($window: ng.IWindowService) => ({
            restrict: 'E',
            link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attributes: ng.IAttributes) => {
                let parent = element.parent();
                scope.$watch(() => parent.outerHeight(), (val: number) => {
                    element.height(val);
                });
                scope.$watch(() => parent.outerWidth(), (val: number) => {
                    element.width(val);
                });

                scope.$watchGroup(
                    [
                        () => parent[0].getBoundingClientRect().top,
                        () => parent[0].getBoundingClientRect().bottom
                    ],
                    (values: number[]) => {
                        if (values[0] < ($window.innerHeight + 100) && values[1] > -100) {
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