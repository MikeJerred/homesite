module MJ.Views.Default.Main.Home {
    class Controller{
        static $inject = ['$anchorScroll'];
        constructor($anchorScroll: ng.IAnchorScrollService) {
            $anchorScroll('top');
        }
    }

    export var view = {
        templateUrl: 'views/default/main/home/home.html',
        controller: Controller
    };
}