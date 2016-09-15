module MJ.Views.Default.Main.Blogs {
    import IUrlBinderService = Services.IUrlBinderService;
    import IPage = DataServices.IPage;
    import IVmBlogStub =  DataServices.Blogs.IVmBlogStub;
    import PageMetaService = Services.IPageMetaService;

    interface IFilter {
    }

    const pageSize = 6;

    class Controller {
        static $inject = ['$scope', 'urlBinder', 'dsBlogs', 'initialBlogPage', 'pageMeta'];
        constructor(
            $scope: ng.IScope,
            urlBinder: IUrlBinderService,
            private dsBlogs: DataServices.Blogs.IDsBlogs,
            initialBlogPage: IPage<IVmBlogStub>,
            pageMeta: PageMetaService) {

            pageMeta.setTitle(null);

            urlBinder.bind($scope, 'blogsCtrl.pageNo', 'pageNo');

            this.blogs = initialBlogPage;
        }

        public blogs: IPage<IVmBlogStub>;
        public filters: IFilter[];
        public filtersCollapsed = true;

        public pageChanged() {
            this.blogs = this.dsBlogs.getBlogStubs(this.blogs.pageNo, pageSize);
        }
    }

    export var view = {
        templateUrl: 'views/default/main/blogs/blogs.html',
        controller: Controller,
        controllerAs: 'blogsCtrl'
    };

    export var resolve = {
        'initialBlogPage': ['$stateParams', 'dsBlogs',
            ($stateParams: ng.ui.IStateParamsService,
            dsBlogs: DataServices.Blogs.IDsBlogs) => {
                const pageNo = $stateParams['pageNo'] || 1;
                return dsBlogs.getBlogStubs(pageNo, pageSize).$promise;
            }]
    };
}