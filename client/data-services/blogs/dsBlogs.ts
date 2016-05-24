module MJ.DataServices.Blogs {
    export interface IDsBlogs {
        getBlogStubs(pageNo: number, pageSize: number): IPage<IVmBlogStub>;
        getBlog(articleId: number): IVmBlog;
    }

    class DsBlogs implements IDsBlogs {
        static $inject = ['$resource'];
        constructor($resource: ng.resource.IResourceService) {
            this.blogs = $resource<IVmBlog>('api/blogs/:id', { id: '@id' });
            this.blogStubs = $resource<IPage<IVmBlogStub>>('api/blog-stubs/:pageNo/:pageSize', { pageNo: '@pageNo', pageSize: '@pageSize' });
        }

        private blogs: ng.resource.IResourceClass<IVmBlog>;
        private blogStubs: ng.resource.IResourceClass<IPage<IVmBlogStub>>;

        public getBlogStubs(pageNo: number, pageSize: number): IPage<IVmBlogStub> {
            return this.blogStubs.get({ pageNo: pageNo, pageSize: pageSize });
        }

        public getBlog(articleId: number): IVmBlog {
            return this.blogs.get({ id: articleId });
        }
    }

    angular.module('mj.services').service('dsBlogs', DsBlogs);
}