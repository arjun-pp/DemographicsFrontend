(function ()
{
    'use strict';

    angular
        .module('app.teacher')
        .factory('TeacherService', TeacherService);

    /** @ngInject */
    function TeacherService($q, msApi)
    {
        var service = {
            getTeacherData: getTeacherData,
            getGraphData: getGraphData
        };

        function getTeacherData($rootScope)
        {
            // Create a new deferred object
            var deferred = $q.defer();

            msApi.request('teacherData@get', {teacherid :$rootScope.activeTeacherId['empid']},

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

        function getGraphData($rootScope)
        {
            // Create a new deferred object
            var deferred = $q.defer();

            msApi.request('teacherAttendanceData@get', {teacherid :$rootScope.activeTeacherId['empid']},

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


        return service;
    }
})();