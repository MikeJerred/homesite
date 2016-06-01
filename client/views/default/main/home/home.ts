module MJ.Views.Default.Main.Home {
    class Controller{
        static $inject = ['$scope'];
        constructor($scope: ng.IScope) {
            $scope.$on('mjInternalStateChange', () => {
                $('html,body').delay(290).animate({ scrollTop: 0 }, 0);
            });
        }
    }

    export var view = {
        templateUrl: 'views/default/main/home/home.html',
        controller: Controller
    };
}