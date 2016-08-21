(function ()
{
    'use strict';

    angular
        .module('app.dashboard', ['googlechart','leaflet-directive'])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider, $logProvider)
    {
        // State
        $logProvider.debugEnabled(false);
        
        $stateProvider
            .state('app.dashboard', {
                url    : '/dashboard',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/dashboard/dashboard.html',
                        controller : 'DashboardController as vm'
                    }
                },
                resolve: {
                    DashboardData: function (msApi)
                    {
                        return msApi.resolve('dashboard@get');
                    }
                }
            });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/dashboard');

        // Google Charts
        // google.charts.load('current', {packages: ['corechart', 'line']});

        // Api
        msApiProvider.register('dashboard', ['app/data/dashboard/dashboard.json']);
        msApiProvider.register('insights', ['app/data/dashboard/insights.json']);
        msApiProvider.register('schoolCoordinates', ['app/data/dashboard/school-coordinates.json']);
        msApiProvider.register('schoolCoordinatesByZone', ['http://localhost:8000/schoolCoordinatesByZone']);

        // msApiProvider.register('zonesSCR', ['http://localhost:8000/reportingData/zonescr']);

        msApiProvider.register('spdReportingData', ['app/data/dashboard/SPD.json']);

        msApiProvider.register('strReportingData', ['app/data/dashboard/STR.json']);

        msApiProvider.register('aserReportingData', ['app/data/dashboard/ASER.json']);

        msApiProvider.register('scrReportingData', ['app/data/dashboard/zonescr.json']);
        msApiProvider.register('studentAttendanceReportingData', ['assets/studlast30.json']);
        msApiProvider.register('teacherAttReportingData', ['app/data/dashboard/teacherAtt.json']);
        msApiProvider.register('classroomAdminData', ['app/data/dashboard/classAdminRatio.json']);
        msApiProvider.register('QI', ['app/data/dashboard/QI.json']);
        msApiProvider.register('dropoutCount', ['app/data/dashboard/dropoutCount.json']);
        // msApiProvider.register('GuestteacherReportingData', ['http://localhost:8000/regvsgt']);
        msApiProvider.register('GuestteacherReportingData', ['app/data/dashboard/zonegtr.json']);
        msApiProvider.register('mapdivs', ['http://localhost:8000/mapdata/mapdivs']);
        msApiProvider.register('VacancyReportingData', ['app/data/dashboard/vacancy.json']);
        msApiProvider.register('aadharEnrollmentsReportingData', ['app/data/dashboard/aadharEnrollments.json']);
        msApiProvider.register('PTRReportingData', ['app/data/dashboard/PTR.json']);
        msApiProvider.register('bankEnrollmentsReportingData', ['app/data/dashboard/bankEnrollments.json']);
        msApiProvider.register('CCEReportingData', ['app/data/dashboard/CCE.json']);
        msApiProvider.register('MarksReportingData', ['app/data/dashboard/Marks.json']);

        // Navigation
        msNavigationServiceProvider.saveItem('dashboard', {
            title : 'Dashboard',
            group : true,
            state    : 'app.dashboard',
            translate: 'DASHBOARD.DASHBOARD_NAV',
            weight: 1
        });

    }
})();