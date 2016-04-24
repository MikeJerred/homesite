module MJ.Views.Default.Header {
    class Controller {
        public show = true;
    }

    export var view = {
        controller : Controller,
        controllerAs: 'headerCtrl',
        templateUrl: 'views/default/header/header.html'
    };
}