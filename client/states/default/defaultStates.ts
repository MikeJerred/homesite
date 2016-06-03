module MJ.States {
    class StateConfig {
        static $inject = ['$stateProvider', '$urlRouterProvider'];
        constructor(
            $stateProvider: ng.ui.IStateProvider,
            $urlRouterProvider: ng.ui.IUrlRouterProvider) {

            const footer = Views.Default.Footer.view;

            $stateProvider
                .state('default', {
                    'abstract': true,
                    views: {
                        '': MJ.States.Default.view,
                        'header@default': Views.Default.Header.view
                    }
                })
                .state('default.home', {
                    url: '/',
                    views: {
                        'main': Views.Default.Main.Home.view,
                        'footer@default.home': footer
                    }
                })
                .state('default.blog', {
                    url: '/blog/:articleId',
                    params: { slideTo: undefined },
                    views: {
                        'main': Views.Default.Main.Blog.view,
                        'footer@default.blog': footer
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