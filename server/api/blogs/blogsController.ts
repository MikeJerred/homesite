import IVmPage = MJ.Models.IVmPage;
import IVmBlog = MJ.Models.Blogs.IVmBlog;
import IVmBlogStub = MJ.Models.Blogs.IVmBlogStub;
import * as BlogsRepository from './data/blogs/blogsRepository';
import * as VmBlogFactory from 'vmBlogFactory';
import * as VmBlogStubFactory from 'vmBlogStubFactory';
import * as express from 'express';
import * as Joi from 'joi';
import * as Router from './api/router';
import validate from './api/validate';

Router.Get(
    'blogs/:id',
    {
        params: { id: Joi.number().integer().required() }
    },
    async function (params): Promise<IVmBlog> {
        const id: number = params.id;

        return VmBlogFactory.build(await BlogsRepository.getBlog(id));
    }
);

Router.Get(
    'blog-stubs',
    {
        query: {
            pageNo: Joi.number().integer().required(),
            pageSize: Joi.number().integer().required()
        }
    },
    async function (params, query): Promise<IVmPage<IVmBlogStub>> {
        const pageNo: number = query.pageNo;
        const pageSize: number = query.pageSize;

        let results = await BlogsRepository.getBlogs(pageNo, pageSize);

        return results.map(VmBlogStubFactory.build).toVmPage();
    }
);
