import { orderBy } from 'lodash';

import Page from '../page';
import { IDmPortfolio } from './dmPortfolios';
import * as data1 from './data/1.json';
import * as data2 from './data/2.json';
import * as data3 from './data/3.json';
import * as data4 from './data/4.json';
import * as data5 from './data/5.json';
import * as data6 from './data/6.json';

const data = [data1, data2, data3, data4, data5, data6];
const dataById = {
    [data1.portfolioId]: data1,
    [data2.portfolioId]: data2,
    [data3.portfolioId]: data3,
    [data4.portfolioId]: data4,
    [data4.portfolioId]: data5,
    [data4.portfolioId]: data6
};

export async function getPortfolio(id: number): Promise<IDmPortfolio> {
    const index = id - 1;
    const portfolio = dataById[index];
    const prevPortfolio = dataById[index - 1];
    const nextPortfolio = dataById[index + 1];

    return {
        ...portfolio,
        prevPortfolio,
        nextPortfolio
    };
}

export async function getPortfoliosPage(pageNo: number, pageSize: number): Promise<Page<IDmPortfolio>> {
    const start = (pageNo - 1) * pageSize;
    const results = orderBy(data, 'updatedDate', 'desc').slice(start, start + pageSize);
    const count = data.length;

    return Page.build(pageNo, pageSize, results, count);
}
