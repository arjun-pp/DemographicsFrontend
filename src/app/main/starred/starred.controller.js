(function ()
{
    'use strict';

    angular
        .module('app.starred')
        .controller('StarredController', StarredController);

    /** @ngInject */
    function StarredController($rootScope, StarredService)
    {
        var vm = this;

        init();

        function init(){
        }
    }
})();