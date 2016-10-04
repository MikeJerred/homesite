module MJ.Directives.Blog.Cards {
    import IPage = DataServices.IPage;
    import IVmBlogStub = DataServices.Blogs.IVmBlogStub;

    class BlogCardsController {
        static $inject = ['dsBlogs'];
        constructor(dsBlogs: DataServices.Blogs.IDsBlogs) {
            this.blogStubs = dsBlogs.getBlogStubs(1, 6);
        }

        public blogStubs: IPage<IVmBlogStub>;
    }

    angular.module('mj.directives').component('blogCards', ({
        controller: BlogCardsController,
        controllerAs: 'blogCardsCtrl',
        templateUrl: 'directives/blog/cards/blog-cards.html'
    }));
}