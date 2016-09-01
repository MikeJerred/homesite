module MJ.Views.Default.Main.Blogs {
    import IUrlBinderService = Services.IUrlBinderService;
    import IPage = DataServices.IPage;
    import IVmBlogStub =  DataServices.Blogs.IVmBlogStub;

    interface IFilter {

    }

    class Controller {
        static $inject = ['$scope', '$stateParams', 'urlBinder', 'dsBlogs'];
        constructor(
            $scope: ng.IScope,
            $stateParams: ng.ui.IStateParamsService,
            urlBinder: IUrlBinderService,
            private dsBlogs: DataServices.Blogs.IDsBlogs) {

            const pageNo = $stateParams['pageNo'] || 1;

            urlBinder.bind($scope, 'blogsCtrl.pageNo', 'pageNo');

            this.blogs = dsBlogs.getBlogStubs(pageNo, this.pageSize);
        }

        private pageSize = 6;

        public blogs: IPage<IVmBlogStub>;
        public filters: IFilter[];
        public filtersCollapsed = true;

        public pageChanged() {
            this.blogs = this.dsBlogs.getBlogStubs(this.blogs.pageNo, this.pageSize);
        }
    }

    export var view = {
        templateUrl: 'views/default/main/blogs/blogs.html',
        controller: Controller,
        controllerAs: 'blogsCtrl'
    };
}