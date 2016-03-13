module MJ.Directives.Page.Head {
    interface IScope {
        imageUrl: string;
        title: string;
        subTitle?: string;
    }

    class PageHeadDirectve implements ng.IDirective {
        public restrict = 'E';
        public scope = {
            imageUrl: '@',
            title: '@',
            subTitle: '@'
        };
        public templateUrl = 'directives/page/head/page-head.html';
    }

    angular.module('mj.directives').directive('pageHead', () => new PageHeadDirectve());
}