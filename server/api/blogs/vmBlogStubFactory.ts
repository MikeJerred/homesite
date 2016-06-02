import {IDmBlog} from '../../data/blogs/dmBlogs';

export function build(model: IDmBlog): MJ.Models.Blogs.IVmBlogStub {
    return {
        id: model.blogId,
        headline: model.headline,
        date: model.updatedDate
    };
}
