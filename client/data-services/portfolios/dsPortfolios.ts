module MJ.DataServices.Portfolios {
    export interface IDsPortfolios {
        getPortfolioStubs(pageNo: number, pageSize: number): IPage<IVmPortfolioStub>;
        getPortfolio(articleId: number): IVmPortfolio;
    }

    class DsPortfolios implements IDsPortfolios {
        static $inject = ['$resource'];
        constructor($resource: ng.resource.IResourceService) {
            this.portfolios = $resource<IVmPortfolio>('api/portfolios/:id', { id: '@id' });
            this.portfolioStubs = $resource<IPage<IVmPortfolioStub>>('api/portfolio-stubs', { pageNo: '@pageNo', pageSize: '@pageSize' });
        }

        private portfolios: ng.resource.IResourceClass<IVmPortfolio>;
        private portfolioStubs: ng.resource.IResourceClass<IPage<IVmPortfolioStub>>;

        public getPortfolioStubs(pageNo: number, pageSize: number): IPage<IVmPortfolioStub> {
            return this.portfolioStubs.get({ pageNo: pageNo, pageSize: pageSize });
        }

        public getPortfolio(articleId: number): IVmPortfolio {
            return this.portfolios.get({ id: articleId });
        }
    }

    angular.module('mj.services').service('dsPortfolios', DsPortfolios);
}
