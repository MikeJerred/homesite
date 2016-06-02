import {IDmBlog} from '../../data/blogs/dmBlogs';

export function build(model: IDmBlog): MJ.Models.Blogs.IVmBlog {
    return {
        id: model.blogId,
        headline: model.headline,
        date: model.updatedDate,
        articleMarkdown: model.markdown
    };
}
