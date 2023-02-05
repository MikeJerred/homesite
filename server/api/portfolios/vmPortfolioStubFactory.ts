import { IVmPortfolioStub } from '@homesite/shared';
import { IDmPortfolio } from '../../data/portfolios/dmPortfolios';

export function build(model: IDmPortfolio): IVmPortfolioStub {
    return {
        id: model.portfolioId,
        headline: model.headline,
        date: new Date(model.updatedDate)
    };
}
