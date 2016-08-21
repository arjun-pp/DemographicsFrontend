(function ()
{
    'use strict';

    angular
        .module('app.student')
        .controller('StudentController', StudentController);

    /** @ngInject */
    function StudentController($scope, $rootScope, StudentService)
    {
        var vm = this;
        init();

        function init(){
            getStudentData();
            changeStudentProfile();
        }

        function changeStudentProfile(){
            $scope.$on('show-student-profile', function(event){
                getStudentData();
            });
        }

        function getStudentData(){
            // $rootScope.activeStudentId
            StudentService.getStudentData().then(function(response){
                vm.student = response.data;
            })
        }

    }
})();