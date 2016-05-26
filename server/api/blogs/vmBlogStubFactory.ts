export function build(model: MJ.Server.Data.Blogs.IDmBlog): MJ.Models.Blogs.IVmBlogStub {
    return {
        id: model.id,
        headline: model.headline,
        date: model.date
    };
}