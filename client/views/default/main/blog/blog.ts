module MJ.Views.Default.Main.Blog {
    import IVmBlog = DataServices.Blogs.IVmBlog;
    import IVmBlogStub = DataServices.Blogs.IVmBlogStub;

    class Controller {
        static $inject = ['$stateParams', 'dsBlogs'];
        constructor(
            $stateParams: ng.ui.IStateParamsService,
            private dsBlogs: DataServices.Blogs.IDsBlogs) {

            const articleId = $stateParams['articleId'];
            this.article = dsBlogs.getBlog(articleId);

            this.slideRight = $stateParams['slideTo'] === 'right';
        }

        public slideRight: boolean;
        public showShareLinks = false;

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