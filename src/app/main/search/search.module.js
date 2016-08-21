(function ()
{
    'use strict';

    angular
        .module('app.search', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        msApiProvider.register('search', ['http://localhost:8000/search']);
    }
})();