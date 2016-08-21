(function ()
{
    'use strict';

    angular
        .module('app.people')
        .controller('PeopleController', PeopleController);

    /** @ngInject */
    function PeopleController($rootScope, PeopleService)
    {
        var vm = this;
        init();

        $rootScope.$on('getPeopleBroadcast', function(event, data){
            vm.getTeachers(data);
            // vm.getStudents(data);
        });

        function init(){
            // methods
            vm.getTeachers = getTeachers;
            vm.getStudents = getStudents;
            vm.showTeacherProfile = showTeacherProfile;
            vm.showStudentProfile = showStudentProfile;
        }

        function showStudentProfile(index){ 
            $rootScope.showStudentProfile = true;
            $rootScope.activeStudentId = vm.students[index];
            $rootScope.$broadcast('show-student-profile');
        }

        function showTeacherProfile(index){
            $rootScope.showTeacherProfile = true;
            $rootScope.activeTeacherId = vm.teachers[index];
            $rootScope.$broadcast('show-teacher-profile');
        }

        function getTeachers(schoolid){
            console.log('get teachers', schoolid);
            vm.showTeachers=true;
            PeopleService.getTeachers(schoolid).then(function(response){
                vm.teachers = response.data;
             });
        }


        function getStudents(schoolid){
            return;
            // vm.showTeachers=false;
            // PeopleService.getStudents(schoolid).then(function(response){
            //     vm.students = response.data;
            // });
        }
    }
})();