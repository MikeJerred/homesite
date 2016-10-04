module MJ.Views.Default.Main.NotFound {
    import PageMetaService = Services.IPageMetaService;

    class Controller {
        static $inject = ['pageMeta'];
        constructor(pageMeta: PageMetaService) {
            pageMeta.setTitle('Not Found');
        }
    }

    export var view = {
        templateUrl: 'views/default/main/not-found/not-found.html',
        controller: Controller,
        controllerAs: 'notFoundCtrl'
    };
}