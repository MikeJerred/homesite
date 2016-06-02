import * as mongoose from 'mongoose';
import Page from '../page';
import {default as Blog, IDmBlog} from './dmBlogs';

export async function getBlog(id: number): Promise<IDmBlog> {
    return await Blog.findOne({ blogId: id }).exec();
}

export async function getBlogs(pageNo: number, pageSize: number): Promise<Page<IDmBlog>> {
    let results = Blog.find({})
        .sort({ updatedDate: 'desc' })
        .skip((pageNo-1)*pageSize)
        .limit(pageSize)
        .select('blogId headline updatedDate')
        .exec();

    let count = Blog.count({}).exec();

    return Page.build(pageNo, pageSize, await results, await count);
}
