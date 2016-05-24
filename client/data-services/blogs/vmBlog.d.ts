declare module MJ.DataServices.Blogs {
    export interface IVmBlog extends ng.resource.IResource<IVmBlog> {
        id: number;
        headline: string;
        date: Date;
        articleMarkdown: string;
    }

    export interface IVmBlogStub extends ng.resource.IResource<IVmBlogStub> {
        id: number;
        headline: string;
        date: Date;
    }
}