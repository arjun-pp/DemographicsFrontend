(function ()
{
    'use strict';

    angular
        .module('app.search')
        .factory('SearchService', SearchService);

    /** @ngInject */
    function SearchService($q, msApi)
    {
        var service = {
            search: search
        };

        function search(searchString)
        {
            // Create a new deferred object
            var deferred = $q.defer();

            msApi.request('search@get', {searchstring: searchString},

                // SUCCESS
                function (response)
                {
                    // Attach the data
                    service.data = response.data;

                    // Resolve the promise
                    console.log(response.data);
                    
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