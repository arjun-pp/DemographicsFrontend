(function ()
{
    'use strict';

    angular
        .module('app.school', ['app.teacher', 'app.student'])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
    	$stateProvider
    		.state('app.school', {
                url: '/school',
    			views  : {
    				'content@app' : {
    					//template: "<h1>School View</h1>"
		                 templateUrl: 'app/main/school/school.html',
		                 controller: 'SchoolController',
	    	             controllerAs: 'vm'
    	        	}
    	        }
    	    })
	    	.state('app.school.item', {
                url: '/:schoolid',
	    		views  : {
                    'content@app': {
		                templateUrl: 'app/main/school/school.html',
		                controller: 'SchoolController as vm',
            		}
        		}
    	    });

        msApiProvider.register('schoolData', ['http://localhost:8000/school']);
        //msApiProvider.register('schoolData', ['app/data/school/school.json']);
    }
})();