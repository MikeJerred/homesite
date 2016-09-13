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

            let offset = this.convertToPx($scope.offset);
            $timeout(() => this.refreshTimer(offset), 400);
        }

        private refreshTimer(offset: number) {
            const self = this;
            this.$timeout(() => {
                const currentPosition = self.$window.scrollY + self.$window.innerHeight;

                if (currentPosition > (self.$element.offset().top + offset)) {
                    self.$element.addClass(self.$scope.cssClass || 'scrolled-past');
                } else {
                    self.refreshTimer(offset);
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