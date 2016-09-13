module MJ.States {
    class DefaultStateConfig {
        static $inject = ['$stateProvider', '$urlRouterProvider'];
        constructor(
            $stateProvider: ng.ui.IStateProvider,
            $urlRouterProvider: ng.ui.IUrlRouterProvider) {

            const footer = Views.Default.Footer.view;

            $stateProvider
                .state('default', {
                    abstract: true,
                    views: {
                        '': MJ.States.Default.view,
                        'header@default': Views.Default.Header.view
                    }
                })
                .state('default.intro', {
                    url: '/',
                    views: {
                        'main': Views.Default.Main.Intro.view
                    }
                })
                .state('default.home', {
                    url: '/home',
                    params: { slideTo: undefined },
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
                .state('default.blogs', {
                    url: '/blogs?{pageNo:int}',
                    reloadOnSearch: false,
                    views: {
                        'main': Views.Default.Main.Blogs.view,
                        'footer@default.blogs': footer
                    }
                })
                .state('default.about', {
                    url: '/about',
                    views: {
                        'main': Views.Default.Main.About.view,
                        'footer@default.about': footer
                    }
                })
                .state('default.notFound', {
                    url: '/not-found',
                    views: {
                        'main': Views.Default.Main.NotFound.view,
                        'footer@default.notFound': footer
                    }
                    // data: {
                    //     metaData: { title: 'Page Not Found' }
                    // }
                });

            $urlRouterProvider.when('', '/');
            $urlRouterProvider.otherwise('/not-found');
        }
    }

    angular.module('mj.states').config(DefaultStateConfig);
}