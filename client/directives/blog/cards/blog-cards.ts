module MJ.Directives.Blog.Cards {
    import IPage = DataServices.IPage;
    import IVmBlogStub = DataServices.Blogs.IVmBlogStub;

    class BlogCardsController {
        public blogStubs: IPage<IVmBlogStub>;

        static $inject = ['dsBlogs'];
        constructor(dsBlogs: DataServices.Blogs.IDsBlogs) {
            this.blogStubs = dsBlogs.getBlogStubs(1, 6);
        }

        private blogData = [
            { id: 1, headline: 'How-to build a successful website!', date: new Date(2015, 12, 22) },
            { id: 2, headline: 'Becoming a Freelance PHP Programmer', date: new Date(2016, 2, 1) },
            { id: 3, headline: 'Publish your new website the right way', date: new Date(2016, 2, 7) },
            { id: 4, headline: 'Marketing a website development company', date: new Date(2016, 3, 16) },
            { id: 5, headline: 'Create a CSS navigation bar showing the current state', date: new Date(2016, 4, 3) },
            { id: 6, headline: 'Testing', date: new Date(2016, 4, 3) }
        ];
    }

    class BlogCardsDirectve implements ng.IDirective {
        public restrict = 'E';
        public controller = BlogCardsController;
        public controllerAs = 'blogCardsCtrl';
        public templateUrl = 'directives/blog/cards/blog-cards.html';
    }

    angular.module('mj.directives').directive('blogCards', () => new BlogCardsDirectve());
}