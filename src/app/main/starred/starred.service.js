(function ()
{
    'use strict';

    angular
        .module('app.starred')
        .factory('StarredService', StarredService);

    /** @ngInject */
    function StarredService($q, msApi)
    {
        var service = {
            getIndicators: getIndicators
        };

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