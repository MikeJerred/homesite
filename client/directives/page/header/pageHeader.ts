module MJ.Directives.Page.Header {
    interface IScope {
        imageUrl: string;
        title: string;
        subTitle?: string;
    }

    class PageHeaderDirectve implements ng.IDirective {
        public restrict = 'E';
        public scope = {
            imageUrl: '@',
            title: '@',
            subTitle: '@'
        };
        public templateUrl = 'directives/page/header/page-header.html';
    }

    angular.module('mj.directives').directive('pageHeader', () => new PageHeaderDirectve());
}