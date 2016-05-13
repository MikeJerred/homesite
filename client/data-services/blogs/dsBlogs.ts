module MJ.DataServices.Blogs {
    export interface IDsBlogs {
        getBlogs(): IVmBlog[];
        getBlog(id: number): IVmBlog;
    }

    class DsBlogs implements IDsBlogs {
        static $inject = ['$resource'];
        constructor($resource: ng.resource.IResourceService) {
            this.blogs = $resource<IVmBlog>('api/blogs/:id', { id: '@id' });
        }

        private blogs: ng.resource.IResourceClass<IVmBlog>;

        public getBlogs(): IVmBlog[] {
            return this.blogs.query();
        }

        public getBlog(id: number): IVmBlog {
            return this.blogs.get({ id: id });
        }
    }

    angular.module('mj.services').service('dsBlogs', DsBlogs);
}