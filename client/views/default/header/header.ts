module MJ.Views.Default.Header {
    class Controller {
        public show = true;
        public expanded = false;

        public expandClick() {
            if (!this.show && this.expanded) {
                // if the menu is expanded we dont want to hide the whole header before it gets collapsed
                this.show = true;
            }

            this.expanded = !this.expanded;
        }
    }

    export var view = {
        controller : Controller,
        controllerAs: 'headerCtrl',
        templateUrl: 'views/default/header/header.html'
    };
}