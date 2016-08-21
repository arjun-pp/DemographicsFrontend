(function ()
{
    'use strict';

    angular
        .module('app.toolbar')
        .controller('ToolbarController', ToolbarController);

    /** @ngInject */
    function ToolbarController($rootScope, $translate, $mdToast)
    {
        var vm = this;

        // Data
        vm.msScrollOptions = {
            suppressScrollX: true
        };
        $rootScope.global = {
            search: ''
        };
    }

})();