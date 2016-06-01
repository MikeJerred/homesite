module MJ.Views.Default.Main.Blog {
    import IVmBlog = DataServices.Blogs.IVmBlog;
    import IVmBlogStub = DataServices.Blogs.IVmBlogStub;

    class Controller {
        static $inject = ['$scope', '$stateParams', 'dsBlogs'];
        constructor(
            $scope: ng.IScope,
            $stateParams: ng.ui.IStateParamsService,
            private dsBlogs: DataServices.Blogs.IDsBlogs) {

            const articleId = $stateParams['articleId'];
            this.article = dsBlogs.getBlog(articleId);

            $scope.$on('mjInternalStateChange', () => {
                $('html,body').delay(290).animate({ scrollTop: 0 }, 0);
            });
        }

        public article: IVmBlog;
        public prevBlog: IVmBlogStub;
        public nextBlog: IVmBlogStub;
    }

    export var view = {
        templateUrl: 'views/default/main/blog/blog.html',
        controller: Controller,
        controllerAs: 'blogCtrl'
    };
}