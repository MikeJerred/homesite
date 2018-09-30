import { IDmPortfolio } from '../../data/portfolios/dmPortfolios';
import { IVmPortfolioStub } from '@homesite/shared/portfolios/vmPortfolioStub';

export function build(model: IDmPortfolio): IVmPortfolioStub {
    return {
        id: model.portfolioId,
        headline: model.headline,
        date: model.updatedDate
    };
}
