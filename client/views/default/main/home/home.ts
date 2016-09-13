module MJ.Views.Default.Main.Home {
    // class Controller {
    //     static $inject = ['$stateParams', '$rootScope'];
    //     constructor($stateParams: ng.ui.IStateParamsService, $rootScope: ng.IRootScopeService) {
    //         this.slideUp = $stateParams['slideTo'] === 'up';

    //         $rootScope.$on(
    //             '$stateChangeStart',
    //             (event: ng.IAngularEvent, toState: ng.ui.IState) => {
    //                 this.slideUp = toState.name === 'default.intro';
    //             });
    //     }

    //     public slideUp: boolean;
    // }

    export var view = {
        templateUrl: 'views/default/main/home/home.html'
        //controller: Controller,
        //controllerAs: 'homeCtrl'
    };
}