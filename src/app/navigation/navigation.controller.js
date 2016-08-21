(function ()
{
    'use strict';

    angular
        .module('app.navigation')
        .controller('NavigationController', NavigationController);

    /** @ngInject */
    function NavigationController($scope, $mdComponentRegistry, $translate, $rootScope, NavigationService, SchoolService, PeopleService, AnalysisService, $mdSidenav)
    {
        var vm = this;
        init();

        $scope.$on('msNavigation::clearActive', 
            function() {
                angular.element('body').toggleClass('ms-navigation-horizontal-mobile-menu-active');
            });

        function init(){
        }
        
        $rootScope.$on('showSchoolSearch', function(event, data){
            $rootScope.directToSchool = false;
            SchoolService.getSchool(data);
            PeopleService.getPeople(data);
            AnalysisService.getScrGraph(data);
            $mdSidenav("school-sidenav").toggle();
        });

        NavigationService.getIndicators().then(function(response){
            $rootScope.indicators = response.data;
            $rootScope.$broadcast('indicatorsLoaded');
        });

        NavigationService.getFilters().then(function(response){
            $rootScope.filterData = response.data;
            $rootScope.$broadcast('filtersLoaded');
        });
    }

})();