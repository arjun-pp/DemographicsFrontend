(function ()
{
    'use strict';

    angular
        .module('app.navigation')
        .factory('NavigationService', NavigationService);

    /** @ngInject */
    function NavigationService($q, msApi)
    {
        var service = {
            getFilters: getFilters,
            getIndicators: getIndicators
        }

        function getFilters()
        {
            // Create a new deferred object
            var deferred = $q.defer();

            msApi.request('filters@get', {},

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


        function getIndicators()
        {
            // Create a new deferred object
            var deferred = $q.defer();

            msApi.request('indicators@get', {},

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