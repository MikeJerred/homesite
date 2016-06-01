module MJ.States {
    class StateConfig {
        static $inject = ['$stateProvider', '$urlRouterProvider'];
        constructor(
            $stateProvider: ng.ui.IStateProvider,
            $urlRouterProvider: ng.ui.IUrlRouterProvider) {

            const header = Views.Default.Header.view;
            const footer = Views.Default.Footer.view;

            $stateProvider
                .state('default', {
                    'abstract': true,
                    templateUrl: 'states/default/default-layout.html'
                })
                .state('default.home', {
                    url: '/',
                    views: {
                        'header': header,
                        'main': Views.Default.Main.Home.view,
                        'footer': footer
                    }
                })
                .state('default.blog', {
                    url: '/blog/:articleId',
                    views: {
                        'header': header,
                        'main': Views.Default.Main.Blog.view,
                        'footer': footer
                    }
                })
                .state('default.about', {
                    url: '/about',
                    views: {
                        'header': header,
                        'main': Views.Default.Main.About.view,
                        'footer': footer
                    }
                })
                //.state('default.blogs', {
                //    url: '/blogs?{page:int}',
                //    params: {
                //        page: 1
                //    },
                //    reloadOnSearch: false,
                //    views: {
                //        'header': header,
                //        'main': Views.Default.Main.Blogs.view,
                //        'footer': footer
                //    },
                //    data: {
                //        metaData: { title: 'Blog' }
                //    }
                //})
                .state('default.notFound', {
                    url: '/not-found',
                    views: {
                        'header': header,
                        //'main': ,
                        'footer': footer
                    },
                    data: {
                        metaData: { title: 'Page Not Found' }
                    }
                });

            $urlRouterProvider.when('', '/');
            $urlRouterProvider.otherwise('/not-found');
        }
    }

    angular.module('mj.states').config(StateConfig);
}