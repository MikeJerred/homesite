module MJ.Views.Default.Main.Blog {
    import IVmBlog = DataServices.Blogs.IVmBlog;
    import IVmBlogStub = DataServices.Blogs.IVmBlogStub;

    class Controller {
        static $inject = ['$stateParams', 'dsBlogs'];
        constructor($stateParams: ng.ui.IStateParamsService, private dsBlogs: DataServices.Blogs.IDsBlogs) {
            const articleId = $stateParams['articleId'];
            this.article = dsBlogs.getBlog(articleId);

            this.slideRight = $stateParams['slideTo'] === 'right';

            this.article.$promise.then(article => {
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
            });
        }

        public slideRight: boolean;
        public showShareLinks = false;

        public linkedInLink: string;
        public facebookLink: string;
        public twitterLink: string;
        public googlePlusLink: string;

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