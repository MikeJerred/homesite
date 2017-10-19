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
                    views: {
                        'main': Views.Default.Main.Home.view,
                        'footer@default.home': footer
                    }
                })
                .state('default.blog', {
                    url: '/blog/:articleId',
                    views: {
                        'main': Views.Default.Main.Blog.view,
                        'footer@default.blog': footer
                    },
                    resolve: Views.Default.Main.Blog.resolve
                })
                .state('default.blogs', {
                    url: '/blogs?{pageNo:int}',
                    reloadOnSearch: false,
                    views: {
                        'main': Views.Default.Main.Blogs.view,
                        'footer@default.blogs': footer
                    },
                    resolve: Views.Default.Main.Blogs.resolve
                })
                .state('default.portfolio', {
                    url: '/portfolio/:articleId',
                    views: {
                        'main': Views.Default.Main.Portfolio.view,
                        'footer@default.portfolio': footer
                    },
                    resolve: Views.Default.Main.Portfolio.resolve
                })
                .state('default.portfolios', {
                    url: '/portfolios?{pageNo:int}',
                    reloadOnSearch: false,
                    views: {
                        'main': Views.Default.Main.Portfolios.view,
                        'footer@default.portfolios': footer
                    },
                    resolve: Views.Default.Main.Portfolios.resolve
                })
                // .state('default.about', {
                //     url: '/about',
                //     views: {
                //         'main': Views.Default.Main.About.view,
                //         'footer@default.about': footer
                //     }
                // })
                .state('default.notFound', {
                    url: '/not-found',
                    views: {
                        'main': Views.Default.Main.NotFound.view,
                        'footer@default.notFound': footer
                    }
                });

            $urlRouterProvider.when('', '/');
            $urlRouterProvider.otherwise('/not-found');
        }
    }

    angular.module('mj.states').config(DefaultStateConfig);
}
