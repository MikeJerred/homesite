module MJ.Directives.Page.ShowOnScroll {
    interface IScope extends ng.IScope {
        show: boolean;
    }

    class Controller {
        static $inject = ['$scope', '$document', '$timeout'];
        constructor(
            private $scope: IScope,
            private $document: ng.IDocumentService,
            private $timeout: ng.ITimeoutService) {

            this.refreshTimer();

            $scope.$on('$stateChangeSuccess', () => {
                this.inTransition = true;
                $timeout(() => { this.inTransition = false; }, 400);
            });
        }

        private lastPosition: number;
        private timeout: ng.IPromise<void>;
        private inTransition = false;

        private refreshTimer() {
            const self = this;
            this.timeout = this.$timeout(() => {
                const currentPosition = self.$document.scrollTop();
                if (!self.inTransition) {
                    if (currentPosition === 0
                        || currentPosition < (self.lastPosition - 40)) {

                        // if we scrolled up by more than delta, or are at the top
                        self.$scope.show = true;
                    } else if (currentPosition > (self.lastPosition + 40)) {

                        // if we scrolled down by more than delta
                        self.$scope.show = false;
                    }
                }

                self.lastPosition = currentPosition;
                self.refreshTimer();
            }, 100);
        }
    }

    angular.module('mj.directives').directive('pageShowOnScroll', () => ({
        restrict: 'A',
        controller: Controller,
        scope: {
            show: '=pageShowOnScroll'
        }
    }));
}