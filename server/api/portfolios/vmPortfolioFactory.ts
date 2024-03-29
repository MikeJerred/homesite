import { IVmPortfolio } from '@homesite/shared';
import { IDmPortfolio } from '../../data/portfolios/dmPortfolios';
import * as VmPortfolioStubFactory from './vmPortfolioStubFactory';

export function build(model: IDmPortfolio): IVmPortfolio {
    let result: IVmPortfolio = {
        id: model.portfolioId,
        headline: model.headline,
        date: new Date(model.updatedDate),
        articleMarkdown: model.markdown
    };

    if (model.prevPortfolio && !(model.prevPortfolio instanceof Number))
        result.prevPortfolio = VmPortfolioStubFactory.build(model.prevPortfolio);

    if (model.nextPortfolio && !(model.nextPortfolio instanceof Number))
        result.nextPortfolio = VmPortfolioStubFactory.build(model.nextPortfolio);

    return result;
}
