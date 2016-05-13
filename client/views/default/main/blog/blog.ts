module MJ.Views.Default.Main.Blog {
    class Controller {
        static $inject = ['$stateParams', 'dsBlogs'];
        constructor(
            $stateParams: ng.ui.IStateParamsService,
            private dsBlogs: DataServices.Blogs.IDsBlogs) {

            let id = $stateParams['id'];
            this.article = dsBlogs.getBlog(id);
        }

        public article: DataServices.Blogs.IVmBlog;
    }

    export var view = {
        templateUrl: 'views/default/main/blog/blog.html',
        controller: Controller,
        controllerAs: 'blogCtrl'
    };
}