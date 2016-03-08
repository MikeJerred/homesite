module MJ.Directives.Page.Meta {
    import PageMetaService = MJ.Services.IPageMetaService;

    angular.module('mj.directives').directive('pageMeta', ['pageMeta', (pageMeta: PageMetaService) => ({
        restrict: 'A',
        link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attributes: ng.IAttributes) => {
            if (element[0].tagName === 'TITLE') {
                scope.$watch(() => pageMeta.getTitle(), title => {
                    element.text(title);
                });
            }
        }
    })]);
}