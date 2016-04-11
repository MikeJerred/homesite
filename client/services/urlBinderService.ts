module MJ.Services {
    export interface IUrlBinderService {
        bind(scope: ng.IScope, name: string, urlParamName: string): Function;
    }

    class UrlBinderService implements IUrlBinderService {
        static $inject = ['$location'];
        constructor(private $location: ng.ILocationService) {
        }

        public bind(scope: ng.IScope, name: string, urlParamName: string): Function {
            // when scope variable changes, update the URL
            var unhookUrlUpdater = scope.$watch(name, function(newValue) {
                this.$location.search(urlParamName, newValue);
            });

            // when the URL changes, update the scope variable
            var unhookScopeUpdater = scope.$on('$locationChangeSuccess', function() {
                var value = this.$location.search()[urlParamName];

                if (!angular.equals(scope[name], value)) {
                    scope[name] = value;
                }
            });

            return () => {
                unhookUrlUpdater();
                unhookScopeUpdater();
            };
        }
    }

    angular.module('mj.services').service('urlBinder', UrlBinderService);
}