module MJ.Views.Default.Main.Intro {
    import PageMetaService = Services.IPageMetaService;

    class Controller {
        static $inject = ['pageMeta'];
        constructor(pageMeta: PageMetaService) {
            pageMeta.setTitle(null);
        }
    }

    export var view = {
        templateUrl: 'views/default/main/intro/intro.html',
        controller: Controller
    };
}