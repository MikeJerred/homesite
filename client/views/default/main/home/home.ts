module MJ.Views.Default.Main.Home {
    import PageMetaService = Services.IPageMetaService;

    class Controller {
        static $inject = ['pageMeta'];
        constructor(pageMeta: PageMetaService) {
            pageMeta.setTitle(null);
        }
    }

    export var view = {
        templateUrl: 'views/default/main/home/home.html',
        controller: Controller
    };
}