module MJ.States {
    class StateConfig {
        static $inject = ['$stateProvider', '$urlRouterProvider'];
        constructor(
            $stateProvider: ng.ui.IStateProvider,
            $urlRouterProvider: ng.ui.IUrlRouterProvider) {

            var header = Views.Default.Header.view;

            $stateProvider
                .state('default', {
                    'abstract': true,
                    templateUrl: 'states/default/default-layout.html',
                    controller: 'normal'
                })
                .state('default.home', {
                    url: '/home',
                    views: {
                        'header': header,
                        'main': Views.Default.Main.Home.view
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
                //        'main': Views.Default.Main.Blogs.view
                //    },
                //    data: {
                //        metaData: { title: 'Blog' }
                //    }
                //})
                .state('default.notFound', {
                    url: '/not-found',
                    views: {
                        'header': header,
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