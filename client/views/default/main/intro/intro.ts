module MJ.Views.Default.Main.Intro {
    import PageMetaService = Services.IPageMetaService;

    class Controller {
        static $inject = ['pageMeta', '$state', '$scope'];
        constructor(pageMeta: PageMetaService, $state: ng.ui.IStateService, $scope: ng.IScope) {
            pageMeta.setTitle(null);

            $(window).on('wheel', event => {
                if ((<WheelEvent>event.originalEvent).deltaY > 0) {

                    $state.transitionTo('default.home');
                }
            });

            $scope.$on('$destroy', () => {
                $(window).off('wheel');
            });
        }
    }

    export var view = {
        templateUrl: 'views/default/main/intro/intro.html',
        controller: Controller
    };
}