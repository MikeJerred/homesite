module MJ.Views.Default.Main.Home {
    import PageMetaService = Services.IPageMetaService;

    class Controller {
        static $inject = ['pageMeta', '$state', '$scope'];
        constructor(pageMeta: PageMetaService, $state: ng.ui.IStateService, $scope: ng.IScope) {
            pageMeta.setTitle(null);

            $(window).on('wheel', event => {
                if ($(window).scrollTop() === 0
                    && (<WheelEvent>event.originalEvent).deltaY < 0) {

                    $state.transitionTo('default.intro');
                }
            });

            $scope.$on('$destroy', () => {
                $(window).off('wheel');
            });
        }
    }

    export var view = {
        templateUrl: 'views/default/main/home/home.html',
        controller: Controller
    };
}