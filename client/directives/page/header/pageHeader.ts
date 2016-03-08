module MJ.Directives.Page.Header {
    class PageHeaderDirectve implements ng.IDirective {
        public restrict = 'E';
        public scope = {
            imageUrl: '@',
            title: '@'
        };
        public templateUrl = 'directives/page/header/page-header.html';
    }

    angular.module('mj.directives').directive('pageHeader', () => new PageHeaderDirectve());
}