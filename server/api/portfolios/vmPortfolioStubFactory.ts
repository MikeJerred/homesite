import {IDmPortfolio} from '../../data/portfolios/dmPortfolios';
import IVmPortfolioStub = MJ.Models.Portfolios.IVmPortfolioStub;

export function build(model: IDmPortfolio): IVmPortfolioStub {
    return {
        id: model.portfolioId,
        headline: model.headline,
        date: model.updatedDate
    };
}
