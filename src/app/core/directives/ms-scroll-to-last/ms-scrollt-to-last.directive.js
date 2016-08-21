(function ()
{
    'use strict';

    angular
        .module('app.core')
        .directive('msScrollToLast', msScrollToLastDirective);

    /** @ngInject */
    function msScrollToLastDirective($location, $anchorScroll)
    {
        return {
            restrict: 'AE',
            link: function (scope, element, attrs){
                $location.hash(attrs.scrollToLast);
                $anchorScroll();
            }
        };
    }
})();