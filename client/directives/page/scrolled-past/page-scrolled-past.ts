module MJ.Directives.Page.ScrolledPast {
    interface IScope extends ng.IScope {
        cssClass: string;
        offset: number;
    }

    class Controller {
        static $inject = ['$scope', '$element', '$document', '$timeout'];
        constructor(
            private $scope: IScope,
            private $element: ng.IAugmentedJQuery,
            private $document: ng.IDocumentService,
            private $timeout: ng.ITimeoutService) {

            this.refreshTimer();
        }

        private timeout: ng.IPromise<void>;

        private refreshTimer() {
            const self = this;
            this.timeout = this.$timeout(() => {
                const currentPosition = self.$document.scrollTop();
                let offset = self.$scope.offset || 0;

                if (currentPosition > (self.$element.offset().top - offset)) {
                    self.$element.addClass(self.$scope.cssClass || 'scrolled-past');
                } else {
                    self.refreshTimer();
                }
            }, 100);
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