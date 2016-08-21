(function ()
{
    'use strict';

    angular
        .module('app.compare', ['ui.grid'])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.compare', {
                url    : '/compare',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/compare/compare.html',
                        controller : 'CompareController as vm'
                    }
                }
                // ,
                // resolve: {
                //     DashboardData: function (msApi)
                //     {
                //         return msApi.resolve('compare@get');
                //     }
                // }
            });

        $translatePartialLoaderProvider.addPart('app/main/compare');

        // Api

        msApiProvider.register('getColumnData', ['http://localhost:8000/compare/getColumnData']);
        // msApiProvider.register('getColumnData', ['app/data/compare/sampleUrl.json']);
        msApiProvider.register('getSchoolList', ['http://localhost:8000/getSchoolList']);
        msApiProvider.register('searcharea', ['http://localhost:8000/searcharea']);

        // Navigation
        msNavigationServiceProvider.saveItem('compare', {
            title : 'Compare',
            group : true,
            state    : 'app.compare',
            translate: 'COMPARE.COMPARE_NAV',
            weight: 1
        });

    }
})();