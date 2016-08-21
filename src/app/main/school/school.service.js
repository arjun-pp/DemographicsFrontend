(function ()
{
    'use strict';

    angular
        .module('app.school')
        .factory('SchoolService', SchoolService);

    /** @ngInject */
    function SchoolService($q, msApi,$rootScope)
    {
        var service = {
            getSchoolData: getSchoolData,
            getSchool: getSchool,
            
        };

        function getSchool(school)
        {
            $rootScope.$broadcast('getdata',{
                data:school
            });
        }

        function getSchoolData(schoolid)
        {
            // Create a new deferred object
            var deferred = $q.defer();

                
                // console.log("in school service",schoolid.data);
                
        
            msApi.request('schoolData@get',{schoolid:schoolid.data},

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