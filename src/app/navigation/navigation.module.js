(function ()
{
    'use strict';

    angular
        .module('app.navigation', [])
        .config(config);

    /** @ngInject */
    function config(msApiProvider)
    {
        msApiProvider.register('indicators', ['http://localhost:8000/indicators']);
        msApiProvider.register('filters', ['http://localhost:8000/mapdata/filters']);
    }
})();