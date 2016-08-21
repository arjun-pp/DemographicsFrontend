(function ()
{
    'use strict';

    angular
        .module('app.search')
        .controller('SearchController', SearchController);

    /** @ngInject */
    function SearchController($rootScope, SearchService, $q)
    {
        var vm = this;

        init();

        function init(){
        	vm.selectedItemChange = selectedItemChange;
            vm.querySearch = querySearch;
        }

        function querySearch(query) {
            var results = SearchService.search(query);
            console.log(results);
            return results;
        }

        function selectedItemChange(params){
            if (params) {
            	$rootScope.$broadcast('showSchoolSearch', params);
            }
        }
    }
})();