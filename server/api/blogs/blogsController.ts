import { IVmPage } from '@homesite/shared/vmPage';
import { IVmBlog } from '@homesite/shared/blogs/vmBlog';
import { IVmBlogStub } from '@homesite/shared/blogs/vmBlogStub';
import * as Joi from 'joi';
import * as Router from '../router';
import * as BlogsRepository from '../../data/blogs/blogsRepository';
import * as VmBlogFactory from './vmBlogFactory';
import * as VmBlogStubFactory from './vmBlogStubFactory';

Router.get(
    '/blogs/:id',
    {
        params: { id: Joi.number().integer().required() }
    },
    async function (params): Promise<IVmBlog> {
        const id: number = params.id;

        return VmBlogFactory.build(await BlogsRepository.getBlog(id));
    }
);

Router.get(
    '/blog-stubs',
    {
        query: {
            pageNo: Joi.number().integer().required(),
            pageSize: Joi.number().integer().required()
        }
    },
    async function (params, query): Promise<IVmPage<IVmBlogStub>> {
        const pageNo: number = query.pageNo;
        const pageSize: number = query.pageSize;

        const results = await BlogsRepository.getBlogsPage(pageNo, pageSize);

        return results.map(VmBlogStubFactory.build).toVmPage();
    }
);
