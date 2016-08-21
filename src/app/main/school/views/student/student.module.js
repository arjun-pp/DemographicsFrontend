(function ()
{
    'use strict';

    angular
        .module('app.student', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        msApiProvider.register('studentData', ['app/data/student/student-data.json']);

    }
})();