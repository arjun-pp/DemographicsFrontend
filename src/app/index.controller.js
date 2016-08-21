(
    function (){
        'use strict';

        angular.module('aap')
                .constant('config', {
                                API_URL: '',
                                Upload_URL: ''
                          })
                .controller('IndexController', IndexController);

    /** @ngInject */
    function IndexController(){
        
    }
})();
