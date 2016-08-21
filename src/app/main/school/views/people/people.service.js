(function ()
{
    'use strict';

    angular
        .module('app.people')
        .factory('PeopleService', PeopleService);

    /** @ngInject */
    function PeopleService($q, msApi, $rootScope, $timeout)
    {
        var service = {
            getTeachers: getTeachers,
            getStudents: getStudents,
            getPeople: getPeople
        };

        function getPeople(school)
        {
            $timeout(function() {
                $rootScope.$broadcast('getPeopleBroadcast',{
                    data:school
                });
            });
        }

        function getTeachers(schoolid)
        {
            // Create a new deferred object
            var deferred = $q.defer();

                // console.log(schoolid.data);
            msApi.request('teachers@get',{schoolid:schoolid.data},

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

        function getStudents(schoolid)
        {
            // Create a new deferred object
            var deferred = $q.defer();

            msApi.request('students@get',{schoolid:schoolid.data},

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