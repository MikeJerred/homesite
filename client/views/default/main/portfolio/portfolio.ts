module MJ.Views.Default.Main.Portfolio {
    import IVmPortfolio = DataServices.Portfolios.IVmPortfolio;
    import IVmPortfolioStub = DataServices.Portfolios.IVmPortfolioStub;
    import PageMetaService = MJ.Services.IPageMetaService;

    class Controller {
        static $inject = ['$state', 'article', 'pageMeta'];
        constructor(
            private $state: ng.ui.IStateService,
            article: IVmPortfolio,
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

        public article: IVmPortfolio;

        public gotoPreviousPortfolio() {
            if (this.article.prevPortfolio)
                this.$state.go('default.portfolio', { articleId: this.article.prevPortfolio.id });
        }

        public gotoNextPortfolio() {
            if (this.article.nextPortfolio)
                this.$state.go('default.portfolio', { articleId: this.article.nextPortfolio.id });
        }
    }

    export var view = {
        templateUrl: 'views/default/main/portfolio/portfolio.html',
        controller: Controller,
        controllerAs: 'portfolioCtrl'
    };

    export var resolve = {
        'article': ['$stateParams', 'dsPortfolios',
            ($stateParams: ng.ui.IStateParamsService,
            dsPortfolios: DataServices.Portfolios.IDsPortfolios) => {
                return dsPortfolios.getPortfolio($stateParams['articleId']).$promise;
            }]
    };
}
