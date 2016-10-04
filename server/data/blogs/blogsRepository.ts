import * as mongoose from 'mongoose';
import Page from '../page';
import {default as Blog, IDmBlog} from './dmBlogs';

export async function getBlog(id: number): Promise<IDmBlog> {
    const blog = await Blog.findOne({ id: id })
        .populate('prevBlog', 'id headline updatedDate')
        .populate('nextBlog', 'id headline updatedDate')
        .exec();

    if (!blog.prevBlog) {
        var prevBlogPromise = Blog.find({ updatedDate: { '$lt': blog.updatedDate } })
            .sort({ updatedDate: 'desc' })
            .limit(1)
            .select('id headline updatedDate')
            .exec();
    }

    if (!blog.nextBlog) {
        var nextBlogPromise = Blog.find({ updatedDate: { '$gt': blog.updatedDate } })
            .sort({ updatedDate: 'asc' })
            .limit(1)
            .select('id headline updatedDate')
            .exec();
    }

    blog.prevBlog = blog.prevBlog || (await prevBlogPromise)[0];
    blog.nextBlog = blog.nextBlog || (await nextBlogPromise)[0];

    return blog;
}

export async function getBlogsPage(pageNo: number, pageSize: number): Promise<Page<IDmBlog>> {
    let results = Blog.find({})
        .sort({ updatedDate: 'desc' })
        .skip((pageNo-1)*pageSize)
        .limit(pageSize)
        .select('id headline updatedDate')
        .exec();

    let count = Blog.count({}).exec();

    return Page.build(pageNo, pageSize, await results, await count);
}
