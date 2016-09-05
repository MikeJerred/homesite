module MJ.Directives.Page.ScrolledPast {
    interface IScope extends ng.IScope {
        cssClass: string;
        offset: number;
    }

    class Controller {
        static $inject = ['$scope', '$element', '$window', '$timeout'];
        constructor(
            private $scope: IScope,
            private $element: ng.IAugmentedJQuery,
            private $window: ng.IWindowService,
            private $timeout: ng.ITimeoutService) {

            this.refreshTimer();
        }

        private timeout: ng.IPromise<void>;

        private refreshTimer() {
            const self = this;
            this.timeout = this.$timeout(() => {
                const currentPosition = self.$window.scrollY + self.$window.innerHeight;
                let offset = this.convertToPx(self.$scope.offset);

                if (currentPosition > (self.$element.offset().top + offset)) {
                    self.$element.addClass(self.$scope.cssClass || 'scrolled-past');
                } else {
                    self.refreshTimer();
                }
            }, 100);
        }

        private convertToPx(length: number | string) : number {
            if ($.isNumeric(length))
                return +length;

            if (/vh$/.test(<string>length)) {
                let proportion = +((<string>length).substr(0, (<string>length).length - 2)) / 100;
                return this.$window.innerHeight * proportion;
            } else if (/vw$/.test(<string>length)) {
                let proportion = +((<string>length).substr(0, (<string>length).length - 2)) / 100;
                return this.$window.innerWidth * proportion;
            } else {
                return 0;
            }
        }
    }

    angular.module('mj.directives').directive('pageScrolledPast', () => ({
        restrict: 'A',
        controller: Controller,
        scope: {
            cssClass: '@pageScrolledPast',
            offset: '@'
        }
    }));
}