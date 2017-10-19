import IVmPage = MJ.Models.IVmPage;
import IVmPortfolio = MJ.Models.Portfolios.IVmPortfolio;
import IVmPortfolioStub = MJ.Models.Portfolios.IVmPortfolioStub;
import * as Joi from 'joi';
import * as Router from '../router';
import * as PortfoliosRepository from '../../data/portfolios/portfoliosRepository';
import * as VmPortfolioFactory from './vmPortfolioFactory';
import * as VmPortfolioStubFactory from './vmPortfolioStubFactory';

Router.get(
    '/portfolios/:id',
    {
        params: { id: Joi.number().integer().required() }
    },
    async function (params): Promise<IVmPortfolio> {
        const id: number = params.id;

        return VmPortfolioFactory.build(await PortfoliosRepository.getPortfolio(id));
    }
);

Router.get(
    '/portfolio-stubs',
    {
        query: {
            pageNo: Joi.number().integer().required(),
            pageSize: Joi.number().integer().required()
        }
    },
    async function (params, query): Promise<IVmPage<IVmPortfolioStub>> {
        const pageNo: number = query.pageNo;
        const pageSize: number = query.pageSize;

        const results = await PortfoliosRepository.getPortfoliosPage(pageNo, pageSize);

        return results.map(VmPortfolioStubFactory.build).toVmPage();
    }
);
