(function ()
{
    'use strict';

    angular
        .module('app.dashboard')
        .factory('AnalysisService', AnalysisService);

    /** @ngInject */
    function AnalysisService($q, msApi,$rootScope)
    {
        var service = {
            getScrGraph: getScrGraph,
            getGraph:getGraph,
            getTeacherAttendanceChart:getTeacherAttendanceChart,
            getPastTeacherAttendanceChart:getPastTeacherAttendanceChart,
            getSchoolDropouts:getSchoolDropouts,
            getSchoolQI:getSchoolQI,
            getGTR1Chart:getGTR1Chart,
            getGTRChart:getGTRChart,
            getVac1Chart:getVac1Chart,
            getVacChart:getVacChart,
            getAadhar1Chart:getAadhar1Chart,
            getAadharChart:getAadharChart,
            getRanks: getRanks,
            getBankEnr1Chart:getBankEnr1Chart,
            getBankEnrChart:getBankEnrChart,
            getPTRChart:getPTRChart,
            getCCEChart:getCCEChart,
            getCce2Chart:getCce2Chart,
            getMarksChart:getMarksChart,
            getAserHindi:getAserHindi,
            getAserMaths:getAserMaths,
            getAserEnglish:getAserEnglish,
            getSPD:getSPD,
            getSTR:getSTR,
            getCAR:getCAR,
            getSCRLine:getSCRLine

        };

        function getScrGraph(schoolid)
        {
            setTimeout( function() {
                $rootScope.$broadcast('fired',{
                    data:schoolid
                });
            }, 0);
        }

        function getGraph(schoolid)
        {
            var deferred = $q.defer();
            msApi.request('classSCR@get',{schoolid:schoolid.data},
                function (response) {
                    service.data = response.data;
                    deferred.resolve(response);
                },
                function (response) {
                    deferred.reject(response);
                }
            );

            return deferred.promise;
        }

        function getRanks(schoolid) {
            var deferred = $q.defer();
            msApi.request('schoolRanks@get',{schoolid:schoolid.data},
                function (response) {
                    service.data = response.data;
                    deferred.resolve(response);
                },
                function (response) {
                    deferred.reject(response);
                }
            );
            return deferred.promise;
        }


        function getSPD(schoolid, index) {
            var deferred = $q.defer();
            msApi.request('schoolSPD@get',{schoolid:schoolid.data, index:index},
                function (response) {
                    service.data = response.data;
                    deferred.resolve(response);
                },
                function (response) {
                    deferred.reject(response);
                }
            );
            return deferred.promise;
        }


        function getSCRLine(schoolid, index) {
            var deferred = $q.defer();
            msApi.request('schoolSCR@get',{schoolid:schoolid.data, index:index},
                function (response) {
                    service.data = response.data;
                    deferred.resolve(response);
                },
                function (response) {
                    deferred.reject(response);
                }
            );
            return deferred.promise;
        }

        function getSTR(schoolid, index) {
            var deferred = $q.defer();
            msApi.request('schoolSTR@get',{schoolid:schoolid.data, index:index},
                function (response) {
                    service.data = response.data;
                    deferred.resolve(response);
                },
                function (response) {
                    deferred.reject(response);
                }
            );
            return deferred.promise;
        }

        function getCAR(schoolid, index) {
            var deferred = $q.defer();
            msApi.request('schoolCAR@get',{schoolid:schoolid.data, index:index},
                function (response) {
                    service.data = response.data;
                    deferred.resolve(response);
                },
                function (response) {
                    deferred.reject(response);
                }
            );
            return deferred.promise;
        }

        function getSchoolDropouts(schoolid)
        {
            var deferred = $q.defer();
            msApi.request('schoolDropouts@get',{schoolid:schoolid.data},
                function (response) {
                    service.data = response.data;
                    deferred.resolve(response);
                },
                function (response) {
                    deferred.reject(response);
                }
            );

            return deferred.promise;
        }

        function getAserHindi(schoolid)
        {
            var deferred = $q.defer();
            msApi.request('aserHindi@get',{schoolid:schoolid.data},
                function (response) {
                    service.data = response.data;
                    deferred.resolve(response);
                },
                function (response) {
                    deferred.reject(response);
                }
            );

            return deferred.promise;
        }

        function getAserEnglish(schoolid)
        {
            var deferred = $q.defer();
            msApi.request('aserEnglish@get',{schoolid:schoolid.data},
                function (response) {
                    service.data = response.data;
                    deferred.resolve(response);
                },
                function (response) {
                    deferred.reject(response);
                }
            );

            return deferred.promise;
        }

        function getAserMaths(schoolid)
        {
            var deferred = $q.defer();
            msApi.request('aserMaths@get',{schoolid:schoolid.data},
                function (response) {
                    service.data = response.data;
                    deferred.resolve(response);
                },
                function (response) {
                    deferred.reject(response);
                }
            );
            return deferred.promise;
        }

        function getGTRChart(schoolid){

            var deferred = $q.defer();
            msApi.request('schoolGTR@get',{schoolid:schoolid.data},
                function (response) {
                    service.data = response.data;
                    deferred.resolve(response);
                },
                function (response) {
                    deferred.reject(response);
                }
            );
            return deferred.promise;

        }

        function getGTR1Chart(schoolid){

            var deferred = $q.defer();
            msApi.request('schoolGTR1@get',{schoolid:schoolid.data},
                function (response) {
                    service.data = response.data;
                    deferred.resolve(response);
                },
                function (response) {
                    deferred.reject(response);
                }
            );
            return deferred.promise;

        }

        function getVac1Chart(schoolid){

            var deferred = $q.defer();
            msApi.request('schoolVac1@get',{schoolid:schoolid.data},
                function (response) {
                    service.data = response.data;
                    deferred.resolve(response);
                },
                function (response) {
                    deferred.reject(response);
                }
            );
            return deferred.promise;

        }

        function getVacChart(schoolid){

            var deferred = $q.defer();
            msApi.request('schoolVac@get',{schoolid:schoolid.data},
                function (response) {
                    service.data = response.data;
                    deferred.resolve(response);
                },
                function (response) {
                    deferred.reject(response);
                }
            );
            return deferred.promise;

        }

        function getAadhar1Chart(schoolid){

            var deferred = $q.defer();
            msApi.request('schoolAadhar1@get',{schoolid:schoolid.data},
                function (response) {
                    service.data = response.data;
                    deferred.resolve(response);
                },
                function (response) {
                    deferred.reject(response);
                }
            );
            return deferred.promise;

        }

        function getAadharChart(schoolid){

            var deferred = $q.defer();
            msApi.request('schoolAadhar@get',{schoolid:schoolid.data},
                function (response) {
                    service.data = response.data;
                    deferred.resolve(response);
                },
                function (response) {
                    deferred.reject(response);
                }
            );
            return deferred.promise;

        }

        function getBankEnrChart(schoolid){

            var deferred = $q.defer();
            msApi.request('schoolBankEnr@get',{schoolid:schoolid.data},
                function (response) {
                    service.data = response.data;
                    deferred.resolve(response);
                },
                function (response) {
                    deferred.reject(response);
                }
            );
            return deferred.promise;

        }

        function getBankEnr1Chart(schoolid){

            var deferred = $q.defer();
            msApi.request('schoolBankEnr1@get',{schoolid:schoolid.data},
                function (response) {
                    service.data = response.data;
                    deferred.resolve(response);
                },
                function (response) {
                    deferred.reject(response);
                }
            );
            return deferred.promise;

        }

        function getPTRChart(schoolid){

            var deferred = $q.defer();
            msApi.request('schoolPTR@get',{schoolid:schoolid.data},
                function (response) {
                    service.data = response.data;
                    deferred.resolve(response);
                },
                function (response) {
                    deferred.reject(response);
                }
            );
            return deferred.promise;

        }

        function getSchoolQI(schoolid)
        {
            var deferred = $q.defer();
            msApi.request('schoolQI@get',{schoolid:schoolid.data},
                function (response) {
                    service.data = response.data;
                    deferred.resolve(response);
                },
                function (response) {
                    deferred.reject(response);
                }
            );
            return deferred.promise;
        }

        function getCCEChart(schoolid)
        {
            var deferred = $q.defer();
            msApi.request('schoolCCE@get',{schoolid:schoolid.data},
                function (response) {
                    service.data = response.data;
                    deferred.resolve(response);
                },
                function (response) {
                    deferred.reject(response);
                }
            );
            return deferred.promise;
        }


        function getCce2Chart(schoolid)
        {
            var deferred = $q.defer();
            msApi.request('schoolCce2@get',{schoolid:schoolid.data},
                function (response) {
                    service.data = response.data;
                    deferred.resolve(response);
                },
                function (response) {
                    deferred.reject(response);
                }
            );
            return deferred.promise;
        }

        function getMarksChart(schoolid)
        {
            var deferred = $q.defer();
            msApi.request('schoolMarks@get',{schoolid:schoolid.data},
                function (response) {
                    service.data = response.data;
                    deferred.resolve(response);
                },
                function (response) {
                    deferred.reject(response);
                }
            );
            return deferred.promise;
        }

        function getTeacherAttendanceChart(schoolid)
        {
            var deferred = $q.defer();
            msApi.request('teacheratt@get',{schoolid:schoolid.data},
                function (response) {
                    service.data = response.data;
                    deferred.resolve(response);
                },
                function (response) {
                    deferred.reject(response);
                }
            );

            return deferred.promise;
        }

        function getPastTeacherAttendanceChart(schoolid)
        {
            var deferred = $q.defer();
            msApi.request('teacherpastatt@get',{schoolid:schoolid.data},
                function (response) {
                    service.data = response.data;
                    deferred.resolve(response);
                },
                function (response) {
                    deferred.reject(response);
                }
            );

            return deferred.promise;
        }

        return service;
    }
})();