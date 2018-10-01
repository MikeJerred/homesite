import { IDmBlog } from '../../data/blogs/dmBlogs';
import { IVmBlogStub } from '@homesite/shared';

export function build(model: IDmBlog): IVmBlogStub {
    return {
        id: model.blogId,
        headline: model.headline,
        date: model.updatedDate
    };
}
