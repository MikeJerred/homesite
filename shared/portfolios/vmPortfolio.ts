import { IVmPortfolioStub } from './vmPortfolioStub';

export interface IVmPortfolio {
    id: number;
    headline: string;
    date: Date;
    articleMarkdown: string;
    prevPortfolio?: IVmPortfolioStub;
    nextPortfolio?: IVmPortfolioStub;
}