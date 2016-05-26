export function build(model: MJ.Server.Data.Blogs.IDmBlog): MJ.Models.Blogs.IVmBlog {
    return {
        id: model.id,
        headline: model.headline,
        date: model.date,
        articleMarkdown: model.markdown
    };
}