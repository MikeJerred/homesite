import { IDmBlog } from '../../data/blogs/dmBlogs';
import * as VmBlogStubFactory from './vmBlogStubFactory';
import { IVmBlog } from '@homesite/shared/blogs/vmBlog';

export function build(model: IDmBlog): IVmBlog {
    let result: IVmBlog = {
        id: model.blogId,
        headline: model.headline,
        date: model.updatedDate,
        articleMarkdown: model.markdown
    };

    if (model.prevBlog && !(model.prevBlog instanceof Number))
        result.prevBlog = VmBlogStubFactory.build(model.prevBlog);

    if (model.nextBlog && !(model.nextBlog instanceof Number))
        result.nextBlog = VmBlogStubFactory.build(model.nextBlog);

    return result;
}
