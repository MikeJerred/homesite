declare module MJ.DataServices.Blogs {
    export interface IVmBlog extends ng.resource.IResource<IVmBlog> {
        id: number;
        headline: string;
        articleMarkdown: string;
    }
}