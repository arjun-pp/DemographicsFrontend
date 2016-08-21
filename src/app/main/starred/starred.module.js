(function ()
{
    'use strict';

    angular
        .module('app.starred', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.starred', {
                url    : '/starred',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/starred/starred.html',
                        controller : 'StarredController as vm'
                    }
                },
                resolve: {
                    StarredData: function (msApi)
                    {
                        return msApi.resolve('starred@get');
                    }
                }
            });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/starred');

        // Google Charts
        // google.charts.load('current', {packages: ['corechart', 'line']});

        // Api
        msApiProvider.register('starred', ['app/data/starred/starred.json']);

    }
})();