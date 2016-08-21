(function ()
{
    'use strict';

    angular
        .module('app.student')
        .factory('StudentService', StudentService);

    /** @ngInject */
    function StudentService($q, msApi)
    {
        var service = {
            getStudentData: getStudentData
        };

        function getStudentData()
        {
            // Create a new deferred object
            var deferred = $q.defer();

            msApi.request('studentData@get', {},

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