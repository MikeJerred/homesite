module MJ.Views.Default.Main.Blog {
    class Controller {
        static $inject = ['$stateParams', 'dsBlogs'];
        constructor(
            $stateParams: ng.ui.IStateParamsService,
            private dsBlogs: DataServices.Blogs.IDsBlogs) {

            let articleId = $stateParams['articleId'];
            this.article = dsBlogs.getBlog(articleId);
        }

        public article: DataServices.Blogs.IVmBlog;
        public prevBlog: DataServices.Blogs.IVmBlog;
        public nextBlog: DataServices.Blogs.IVmBlog;
    }

    export var view = {
        templateUrl: 'views/default/main/blog/blog.html',
        controller: Controller,
        controllerAs: 'blogCtrl'
    };
}