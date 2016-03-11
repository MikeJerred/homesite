module MJ.States {
    class StateConfig {
        static $inject = ['$urlMatcherFactoryProvider', '$locationProvider'];
        constructor(
            $urlMatcherFactoryProvider: ng.ui.IUrlMatcherFactory,
            $locationProvider: ng.ILocationProvider) {

            $urlMatcherFactoryProvider.strictMode(false);
            $locationProvider.html5Mode(true);
        }
    }

    angular.module('mj.states').config(StateConfig);
}