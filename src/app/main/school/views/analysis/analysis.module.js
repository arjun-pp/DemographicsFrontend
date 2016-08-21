(function ()
{
    'use strict';

    angular
        .module('app.analysis', ['ui.grid'])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        msApiProvider.register('classSCR', ['http://localhost:8000/graphData/classSCR']);
        msApiProvider.register('schoolSCR', ['http://localhost:8000/graphData/schoolSCR']);
        msApiProvider.register('teacheratt', ['http://localhost:8000/attendance/teacher/last30']);
        msApiProvider.register('teacherpastatt', ['http://localhost:8000/attendance/previousmonths']);
        msApiProvider.register('schoolRanks', ['http://localhost:8000/schoolRanks']);
        msApiProvider.register('aserHindi', ['http://localhost:8000/graphData/aserHindi']);
        msApiProvider.register('aserEnglish', ['http://localhost:8000/graphData/aserEnglish']);
        msApiProvider.register('aserMaths', ['http://localhost:8000/graphData/aserMaths']);
        msApiProvider.register('schoolDropouts', ['http://localhost:8000/graphData/schoolDropout']);
        msApiProvider.register('schoolQI', ['http://localhost:8000/graphData/schoolQI']);
        msApiProvider.register('schoolGTR', ['http://localhost:8000/schoolGTR']);
        msApiProvider.register('schoolGTR1', ['http://localhost:8000/schoolGTR1']);
        msApiProvider.register('schoolVac', ['http://localhost:8000/schoolVac']);
        msApiProvider.register('schoolVac1', ['http://localhost:8000/schoolVac1']);
        msApiProvider.register('schoolAadhar1', ['http://localhost:8000/schoolAadhar1']);
        msApiProvider.register('schoolAadhar', ['http://localhost:8000/schoolAadhar']);
        msApiProvider.register('schoolBankEnr1', ['http://localhost:8000/schoolBankEnr1']);
        msApiProvider.register('schoolBankEnr', ['http://localhost:8000/schoolBankEnr']);
        msApiProvider.register('schoolPTR', ['http://localhost:8000/schoolPTR']);
        msApiProvider.register('schoolCCE', ['http://localhost:8000/schoolCCE']);
        msApiProvider.register('schoolCce2', ['http://localhost:8000/schoolCce2']);
        msApiProvider.register('schoolMarks',['http://localhost:8000/schoolMarks']);

        msApiProvider.register('schoolCAR', ['http://localhost:8000/graphData/CAR']);
        msApiProvider.register('schoolSTR', ['http://localhost:8000/graphData/STR']);
        msApiProvider.register('schoolSPD', ['http://localhost:8000/graphData/SPD']);
        // msApiProvider.register('schoolscr', ['app/data/analysis/classSCR.json']);
        // msApiProvider.register('teacheratt', ['app/data/analysis/teacher.json']);
    }
}   )();