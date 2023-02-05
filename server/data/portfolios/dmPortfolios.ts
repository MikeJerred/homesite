export interface IDmPortfolio {
    portfolioId: number;
    prevPortfolio?: IDmPortfolio;
    nextPortfolio?: IDmPortfolio;
    headline: string;
    updatedDate: number;
    markdown: string;
}
