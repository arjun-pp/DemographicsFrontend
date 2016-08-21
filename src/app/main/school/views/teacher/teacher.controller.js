(function ()
{
    'use strict';

    angular
        .module('app.teacher')
        .controller('TeacherController', TeacherController);

    /** @ngInject */
    function TeacherController($scope, $rootScope, TeacherService)
    {
        var vm = this;
        init();

        function init(){
            getTeacherData();
            changeTeacherProfile();
            getGraphData();
            vm.closeTeacherProfile = closeTeacherProfile;
        }

        function changeTeacherProfile(){
            $scope.$on('show-teacher-profile', function(event){
                getTeacherData();
                getGraphData();
            });
        }

        function closeTeacherProfile() {
            $rootScope.showTeacherProfile = false;
        }

        function getTeacherData(){            
            TeacherService.getTeacherData($rootScope).then(function(response){
                vm.teacher=response.data[0];
            });
        }

        function getGraphData(){
            TeacherService.getGraphData($rootScope).then(function(response){

                vm.labels=["Jan","Feb","March","April","May"];

                var define=[
                  ['Month', 'Attendance']
                ];

                response.data.forEach(function(item,j){
                    define.push([vm.labels[j],item.attendance]);
                });

                vm.myChartObject = {};
                vm.myChartObject.type = "LineChart";
                vm.myChartObject.data = define;
            });
        }

    }
})();