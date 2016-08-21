(function ()
{
    'use strict';

    angular
        .module('app.teacher',[])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        // msApiProvider.register('teacherData', ['http://localhost:8000/teacher']);
        // msApiProvider.register('teacherAttendanceData', ['http://localhost:8000/attendance/teacher']);
        msApiProvider.register('teacherData', ['app/data/teacher/teacherData.json']);
        msApiProvider.register('teacherAttendanceData', ['app/data/teacher/teacherAttendanceData.json']);
    }
})();