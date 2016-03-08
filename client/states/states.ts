module MJ.States {
    class StateConfig {
        static $inject = ['$urlMatcherFactoryProvider'];
        constructor(
            $urlMatcherFactoryProvider: ng.ui.IUrlMatcherFactory) {

            $urlMatcherFactoryProvider.strictMode(false);
        }
    }

    angular.module('mj.states').config(StateConfig);
}