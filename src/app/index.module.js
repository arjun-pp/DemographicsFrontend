(function ()
{
    'use strict';

    /**
     * Main module of the aap
     */
    angular
        .module('aap', [
            // Core
            'app.core',
            'app.search',
            'app.navigation',
            'app.dashboard',
            'app.compare',
            'app.school',
            'app.starred',
            'app.people',
            'app.analysis'
        ]);
})();