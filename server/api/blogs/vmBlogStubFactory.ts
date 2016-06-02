import {IDmBlog} from '../../data/blogs/dmBlogs';
import IVmBlogStub = MJ.Models.Blogs.IVmBlogStub;

export function build(model: IDmBlog): IVmBlogStub {
    return {
        id: model.id,
        headline: model.headline,
        date: model.updatedDate
    };
}
