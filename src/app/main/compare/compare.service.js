(function ()
{
    'use strict';

    angular
        .module('app.compare')
        .factory('CompareService', CompareService);

    /** @ngInject */
    function CompareService($q, msApi)
    {
        var service = {
            getColumnData: getColumnData,
            searcharea: searcharea,
            getSchoolList: getSchoolList
        };
        
        function getSchoolList(area)
        {
            // Create a new deferred object
            var deferred = $q.defer();
            msApi.request('getSchoolList@get', area,
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

        function getColumnData(area, dict)
        {
            // Create a new deferred object
            var deferred = $q.defer();
            dict['area'] = area;
            msApi.request('getColumnData@save', dict,
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

        function searcharea(searchString)
        {
            // Create a new deferred object
            var deferred = $q.defer();

            msApi.request('searcharea@get', {searchstring: searchString},

                // SUCCESS
                function (response)
                {
                    // Attach the data
                    service.data = response.data;

                    // Resolve the promise
                    deferred.resolve(response.data);
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