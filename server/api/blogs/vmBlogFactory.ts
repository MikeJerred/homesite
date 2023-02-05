import { IVmBlog } from '@homesite/shared';

import { IDmBlog } from '../../data/blogs/dmBlogs';
import * as VmBlogStubFactory from './vmBlogStubFactory';

export function build(model: IDmBlog): IVmBlog {
    let result: IVmBlog = {
        id: model.blogId,
        headline: model.headline,
        date: new Date(model.updatedDate),
        articleMarkdown: model.markdown
    };

    if (model.prevBlog && !(model.prevBlog instanceof Number))
        result.prevBlog = VmBlogStubFactory.build(model.prevBlog);

    if (model.nextBlog && !(model.nextBlog instanceof Number))
        result.nextBlog = VmBlogStubFactory.build(model.nextBlog);

    return result;
}
