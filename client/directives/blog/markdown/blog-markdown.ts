module MJ.Directives.Blog.Markdown {
    interface IScope {
    }

    class BlogMardownController {
        static $inject = ['$scope'];
        constructor($scope: IScope) {
        }
    }

    class BlogMarkdownDirectve implements ng.IDirective {
        public restrict = 'E';
        //public scope = {};
        public controller = BlogMardownController;
        public controllerAs = 'blogMarkdownCtrl';
        public template = '<article class="blog-markdown" ng-bind-html=""></article>';
        public link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attributes: ng.IAttributes) => {

        };
    }

    angular.module('mj.directives').directive('blogMarkdown', () => new BlogMarkdownDirectve());
}