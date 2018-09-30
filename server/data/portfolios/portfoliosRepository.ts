import Page from '../page';
import {default as Portfolio, IDmPortfolio} from './dmPortfolios';

export async function getPortfolio(id: number): Promise<IDmPortfolio> {
    const portfolio = await Portfolio.findOne({ portfolioId: id })
        .populate('prevPortfolio', 'portfolioId headline updatedDate')
        .populate('nextPortfolio', 'portfolioId headline updatedDate')
        .exec();

    if (!portfolio.prevPortfolio) {
        var prevPortfolioPromise = Portfolio.find({ updatedDate: { '$lt': portfolio.updatedDate } })
            .sort({ updatedDate: 'desc' })
            .limit(1)
            .select('portfolioId headline updatedDate')
            .exec();
    }

    if (!portfolio.nextPortfolio) {
        var nextPortfolioPromise = Portfolio.find({ updatedDate: { '$gt': portfolio.updatedDate } })
            .sort({ updatedDate: 'asc' })
            .limit(1)
            .select('portfolioId headline updatedDate')
            .exec();
    }

    portfolio.prevPortfolio = portfolio.prevPortfolio || (await prevPortfolioPromise)[0];
    portfolio.nextPortfolio = portfolio.nextPortfolio || (await nextPortfolioPromise)[0];

    return portfolio;
}

export async function getPortfoliosPage(pageNo: number, pageSize: number): Promise<Page<IDmPortfolio>> {
    let results = Portfolio.find({})
        .sort({ updatedDate: 'desc' })
        .skip((pageNo-1)*pageSize)
        .limit(pageSize)
        .select('portfolioId headline updatedDate')
        .exec();

    let count = Portfolio.count({}).exec();

    return Page.build(pageNo, pageSize, await results, await count);
}
