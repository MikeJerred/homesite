module MJ.Views.Default.Header {
    class Controller {
        static $inject = ['$rootScope'];
        constructor($rootScope: ng.IRootScopeService) {
            $rootScope.$on('$stateChangeSuccess', (event: ng.IAngularEvent, toState: ng.ui.IState) => {
                if (toState.name === 'default.intro')
                    this.expanded = false;
            });
        }

        public show = true;
        public expanded = false;

        public expandClick() {
            if (!this.show && this.expanded) {
                // if the menu is expanded we don't want to hide the whole header before it gets collapsed
                this.show = true;
            }

            this.expanded = !this.expanded;
        }

        public scrollToBottom() {
            $('html, body').animate({ scrollTop: $('footer.footer').offset().top }, 300);
        }

        public isScrolledToTop() : boolean {
            return $('body').scrollTop() === 0;
        }

        public shouldHide() {
            return !this.show && !this.expanded;
        }
    }

    export var view = {
        controller : Controller,
        controllerAs: 'headerCtrl',
        templateUrl: 'views/default/header/header.html'
    };
}