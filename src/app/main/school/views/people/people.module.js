(function ()
{
    'use strict';

    angular
        .module('app.people', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        // msApiProvider.register('teachers', ['http://localhost:8000/teachers']);
        // msApiProvider.register('students', ['http://localhost:8000/students']);

        msApiProvider.register('teachers', ['app/data/people/teachers.json']);
    }
}   )();