declare module MJ.DataServices.Blogs {
    export interface IVmBlog extends MJ.Models.Blogs.IVmBlog, ng.resource.IResource<IVmBlog> {}
    export interface IVmBlogStub extends MJ.Models.Blogs.IVmBlogStub, ng.resource.IResource<IVmBlogStub> {}
}