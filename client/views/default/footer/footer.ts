module MJ.Views.Default.Footer {
    class Controller {
        static $inject = ['$window'];
        constructor(private $window: ng.IWindowService) {
        }

        public scrollTop() {
            $('html,body').animate({ scrollTop: 0 });
        }
    }

    export var view = {
        templateUrl: 'views/default/footer/footer.html',
        controller: Controller,
        controllerAs: 'footerCtrl'
    };
}