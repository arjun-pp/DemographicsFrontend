(function ()
{
    'use strict';

    angular
        .module('app.school')
        .controller('SchoolController', SchoolController);

    /** @ngInject */
    function SchoolController($rootScope, SchoolService, $mdSidenav, $log, $stateParams, PeopleService, AnalysisService, DashboardService, $window)
    {
        var vm = this;
        init();

        $rootScope.$on('getdata',function(event,data){
            vm.getSchoolData(data);
        });

        function init(){
            // getSchoolData();
            vm.showSchool = showSchool;
            vm.getSchoolData=getSchoolData;
            vm.close = close;
            // console.log($mdSidenav);

            if ($stateParams.schoolid) {
                var schoolid = $stateParams.schoolid;
                $rootScope.directToSchool = true;

                console.log('schoolid', schoolid);
                getSchoolData({'data':schoolid});
                PeopleService.getPeople(schoolid);
                AnalysisService.getScrGraph(schoolid);
            }
        }

        function close(){
            if ($rootScope.directToSchool) {
                $window.history.back();
            }
            else {
                $mdSidenav('school-sidenav').close()
                .then(function() {
                    $log.debug("close LEFT is done");
                });
            }
        }

        function showSchool(){
            $rootScope.showTeacherProfile = false;
            $rootScope.showStudentProfile = false;
             // getSchoolData();
            // console.log("cool");
        }

        function getSchoolData(schoolid){
            SchoolService.getSchoolData(schoolid).then(function(response){
                // console.log("in school");
                // console.log(response.data);
        	   vm.schoolData = response.data[0];
        	   // vm.schoolData = angular.extend(vm.schoolData, {"style": {"background": "#e06d6d"}})
            })
        }
    }
})();