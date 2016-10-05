module MJ.Views.Default.Main.Blog {
    import IVmBlog = DataServices.Blogs.IVmBlog;
    import IVmBlogStub = DataServices.Blogs.IVmBlogStub;
    import PageMetaService = MJ.Services.IPageMetaService;

    class Controller {
        static $inject = ['$state', 'article', 'pageMeta'];
        constructor(
            private $state: ng.ui.IStateService,
            article: IVmBlog,
            pageMeta: PageMetaService) {

            this.article = article;

            pageMeta.setTitle(article.headline);

            const url = encodeURIComponent(window.location.href);
            const title = article.headline;
            const summary = '';

            this.linkedInLink = 'https://www.linkedin.com/shareArticle?mini=true&url=' + url
                + '&title=' + title
                + '&summary=' + summary
                + '&source=' + url;
            this.facebookLink = 'https://www.facebook.com/sharer/sharer.php?u=' + url + '&title=' + title;
            this.googlePlusLink = 'https://plus.google.com/share?url=' + url;
            this.twitterLink = 'https://twitter.com/intent/tweet/?source=' + url + '&text=' + title + ':%20' + url;
        }

        public showShareLinks = false;

        public linkedInLink: string;
        public facebookLink: string;
        public twitterLink: string;
        public googlePlusLink: string;

        public article: IVmBlog;

        public gotoPreviousBlog() {
            if (this.article.prevBlog)
                this.$state.go('default.blog', { articleId: this.article.prevBlog.id });
        }

        public gotoNextBlog() {
            if (this.article.nextBlog)
                this.$state.go('default.blog', { articleId: this.article.nextBlog.id });
        }
    }

    export var view = {
        templateUrl: 'views/default/main/blog/blog.html',
        controller: Controller,
        controllerAs: 'blogCtrl'
    };

    export var resolve = {
        'article': ['$stateParams', 'dsBlogs',
            ($stateParams: ng.ui.IStateParamsService,
            dsBlogs: DataServices.Blogs.IDsBlogs) => {
                return dsBlogs.getBlog($stateParams['articleId']).$promise;
            }]
    };
}