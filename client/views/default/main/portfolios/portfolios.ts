module MJ.Views.Default.Main.Portfolios {
    import IUrlBinderService = Services.IUrlBinderService;
    import IPage = DataServices.IPage;
    import IVmPortfolioStub =  DataServices.Portfolios.IVmPortfolioStub;
    import PageMetaService = Services.IPageMetaService;

    interface IFilter {
    }

    const pageSize = 6;

    class Controller {
        static $inject = ['$scope', 'urlBinder', 'dsPortfolios', 'initialPortfolioPage', 'pageMeta'];
        constructor(
            $scope: ng.IScope,
            urlBinder: IUrlBinderService,
            private dsPortfolios: DataServices.Portfolios.IDsPortfolios,
            initialPortfolioPage: IPage<IVmPortfolioStub>,
            pageMeta: PageMetaService) {

            pageMeta.setTitle(null);

            urlBinder.bind($scope, 'portfoliosCtrl.pageNo', 'pageNo');

            this.portfolios = initialPortfolioPage;
        }

        public portfolios: IPage<IVmPortfolioStub>;
        public filters: IFilter[];
        public filtersCollapsed = true;

        public pageChanged() {
            this.portfolios = this.dsPortfolios.getPortfolioStubs(this.portfolios.pageNo, pageSize);
        }
    }

    export var view = {
        templateUrl: 'views/default/main/portfolios/portfolios.html',
        controller: Controller,
        controllerAs: 'portfoliosCtrl'
    };

    export var resolve = {
        'initialPortfolioPage': ['$stateParams', 'dsPortfolios',
            ($stateParams: ng.ui.IStateParamsService,
            dsPortfolios: DataServices.Portfolios.IDsPortfolios) => {
                const pageNo = $stateParams['pageNo'] || 1;
                return dsPortfolios.getPortfolioStubs(pageNo, pageSize).$promise;
            }]
    };
}
