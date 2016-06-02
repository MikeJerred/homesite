declare module MJ.Models.Blogs {
    export interface IVmBlog {
        id: number;
        headline: string;
        date: Date;
        articleMarkdown: string;
        prevBlog?: IVmBlogStub;
        nextBlog?: IVmBlogStub;
    }
}
