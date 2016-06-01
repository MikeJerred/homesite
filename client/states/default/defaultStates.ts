module MJ.States {
    class StateConfig {
        static $inject = ['$stateProvider', '$urlRouterProvider'];
        constructor(
            $stateProvider: ng.ui.IStateProvider,
            $urlRouterProvider: ng.ui.IUrlRouterProvider) {

            $stateProvider
                .state('default', {
                    'abstract': true,
                    //templateUrl: 'states/default/default-layout.html',
                    views: {
                        '': { templateUrl: 'states/default/default-layout.html' },
                        'header@default': Views.Default.Header.view,
                        'footer@default': Views.Default.Footer.view
                    }
                })
                .state('default.home', {
                    url: '/',
                    views: {
                        'main': Views.Default.Main.Home.view
                    }
                })
                .state('default.blog', {
                    url: '/blog/:articleId',
                    views: {
                        'main': Views.Default.Main.Blog.view
                    }
                })
                .state('default.about', {
                    url: '/about',
                    views: {
                        'main': Views.Default.Main.About.view
                    }
                })
                //.state('default.blogs', {
                //    url: '/blogs?{page:int}',
                //    params: {
                //        page: 1
                //    },
                //    reloadOnSearch: false,
                //    views: {
                //        'main': Views.Default.Main.Blogs.view
                //    },
                //    data: {
                //        metaData: { title: 'Blog' }
                //    }
                //})
                .state('default.notFound', {
                    url: '/not-found',
                    views: {
                        //'main':
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