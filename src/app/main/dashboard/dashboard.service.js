(function ()
{
    'use strict';

    angular
        .module('app.dashboard')
        .factory('DashboardService', DashboardService);

    /** @ngInject */
    function DashboardService($q, msApi)
    {
        var service = {
            getInsights: getInsights,
            getSchoolCoordinates: getSchoolCoordinates,
            getReportingData: getReportingData,
            getSchoolCoordinatesByZone:getSchoolCoordinatesByZone,
            getMapDivs: getMapDivs,
            getQI: getQI
        };

         function getMapDivs()
        {
            // Create a new deferred object
            var deferred = $q.defer();

            msApi.request('mapdivs@get', {},

                // SUCCESS
                function (response)
                {
                    // Attach the data
                    service.data = response.data;

                    // Resolve the promise
                    deferred.resolve(response);
                },

                // ERROR
                function (response)
                {
                    // Reject the promise
                    deferred.reject(response);
                }
            );

            return deferred.promise;
        }

        function getQI()
        {
            // Create a new deferred object
            var deferred = $q.defer();

            msApi.request('QI@get', {},

                // SUCCESS
                function (response)
                {
                    // Attach the data
                    service.data = response.data;

                    // Resolve the promise
                    deferred.resolve(response);
                },

                // ERROR
                function (response)
                {
                    // Reject the promise
                    deferred.reject(response);
                }
            );

            return deferred.promise;
        }

        function getReportingData(index)
        {
            // Create a new deferred object
            var deferred = $q.defer();

            var msApiIndexed = ['scrReportingData@get', 'teacherAttReportingData@get', 'studentAttendanceReportingData@get','GuestteacherReportingData@get', 'classroomAdminData@get', 'QI@get','dropoutCount@get','VacancyReportingData@get','aadharEnrollmentsReportingData@get','PTRReportingData@get','bankEnrollmentsReportingData@get','aserReportingData@get','aserReportingData@get','aserReportingData@get','strReportingData@get','CCEReportingData@get', 'spdReportingData@get','MarksReportingData@get'];

            msApi.request(msApiIndexed[index], {},

                // SUCCESS
                function (response)
                {
                    // Attach the data
                    service.data = response.data;

                    // Resolve the promise
                    deferred.resolve(response);
                },

                // ERROR
                function (response)
                {
                    // Reject the promise
                    deferred.reject(response);
                }
            );

            return deferred.promise;
        }

        function getInsights()
        {
            // Create a new deferred object
            var deferred = $q.defer();

            msApi.request('insights@get', {},

                // SUCCESS
                function (response)
                {
                    // Attach the data
                    service.data = response.data;

                    // Resolve the promise
                    deferred.resolve(response);
                },

                // ERROR
                function (response)
                {
                    // Reject the promise
                    deferred.reject(response);
                }
            );

            return deferred.promise;
        }


        function getSchoolCoordinatesByZone(zid)
        {
            var deferred = $q.defer();

            msApi.request('schoolCoordinatesByZone@get',{zoneid:zid},

                // SUCCESS
                function (response)
                {
                    // Attach the data
                    service.data = response.data;
                    //console.log(response.data);
                    // console.log(response.data);
                    // Resolve the promise
                    deferred.resolve(response);
                },

                // ERROR
                function (response)
                {
                    // Reject the promise
                    deferred.reject(response);
                }
            );

            return deferred.promise;
        }

        function getSchoolCoordinates()
        {
            // Create a new deferred object
            var deferred = $q.defer();

            msApi.request('schoolCoordinates@get', {},

                // SUCCESS
                function (response)
                {
                    // Attach the data
                    service.data = response.data;
                    console.log(response.data);
                    // Resolve the promise
                    deferred.resolve(response);
                },

                // ERROR
                function (response)
                {
                    // Reject the promise
                    deferred.reject(response);
                }
            );

            return deferred.promise;
        }

        return service;
    }
})();