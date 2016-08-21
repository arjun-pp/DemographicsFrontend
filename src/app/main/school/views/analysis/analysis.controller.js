(function ()
{
    'use strict';
    angular
        .module('app.analysis')
        .controller('AnalysisController', AnalysisController,'AppCtrl');

    /** @ngInject */
    function AnalysisController($rootScope, AnalysisService, $mdSidenav, $log, $timeout, $mdMedia, $scope)
    {
        var vm = this;
        init();

        function init(){
            vm.activeIndex = 0;
            vm.flag = 1;
            vm.makeActive = makeActive;
            vm.ranks=[];

            getChartSize();

            vm.funcs = [[getSCRBar, getSCRLine],[getTeacherAttendanceChart, getPastTeacherAttendanceChart, getLowTeacherAttendanceChart],[getStudentAttendanceChart, getPastStudentAttendanceChart, getStudentLowAttn],[getGTR1Chart,getGTRChart],[getCARRChart],[getQIChart, getQI1Chart],[getDropChart],[getVacChart,getVac1Chart],[getAadharChart,getAadhar1Chart],[getPtrChart], [getBankEnrChart, getBankEnr1Chart], [getAserHindiChart], [getAserEngChart], [getAserMathChart], [getToiletChart], [getCCEChart,getCce2Chart], [getDeskChart], [getMarksChart]];

            vm.activeSchools=[];
            vm.toggle=toggle;
        }

        $rootScope.$on('fired',function(event,data){
            vm.schoolid=data;
            makeActive($rootScope.activeIndicatorIndex || 0);
        });

        function toggle(){
            $mdSidenav('indicator-menu-sidenav').toggle();
        }

        function getChartSize() {
            if ($mdMedia('xs')) {
                vm.chartWidth = "400";
                vm.chartHeight = "300";
            }
            else if ($mdMedia('sm')) {
                vm.chartWidth = "400";
                vm.chartHeight = "300";
            }
            else if ($mdMedia('md')) {
                vm.chartWidth = "400";
                vm.chartHeight = "300";
            }
            else {
                vm.chartWidth = "500";
                vm.chartHeight = "400";
            }
        }

        function makeActive(index){
            $mdSidenav('indicator-menu-sidenav').close();

            if (index !== vm.activeIndex) {
                $rootScope.indicators[index].active = true;
                $rootScope.indicators[vm.activeIndex].active = false;
                vm.activeIndex = index;
            }
            
            //reloadGraphs if either this new index doesn't have a school or has an old one
            var graphReload = 0;
            graphReload = (vm.activeSchools[index] === null) || (vm.activeSchools[index] !== vm.schoolid.data);

            if (graphReload) {
                vm.loadingCharts = true;
                vm.funcs[index].forEach(function(item, i) {
                    item(vm.schoolid, vm.activeIndex);
                    vm.activeSchools[index] = vm.schoolid.data;
                });
            }

            vm.flag = 0;
            //second argument will send true if need to index

            //check behavior on changing school
            if (vm.activeSchoolId != vm.schoolid.data) {
                vm.loadingRanks = true;
                AnalysisService.getRanks(vm.schoolid).then(function(response){
                    vm.loadingRanks = false;
                    var ranksData = response.data;
                    vm.ranks = ranksData.map(function (item) {return item.rank;});
                    var colors = vm.ranks.map(function (item) {
                        var col = "";

                        for (var i=1; i<=7; i++) {
                            if (item < 1100*i/4) {
                                col = "shade" + i;
                                break;
                            }
                        }

                        return col=='shade1' ? '#bd0026' :  //670216
                        // col=='shade2' ? '#be2c40' :  //6a1723
                        col=='shade2' ? '#fc4e2a' :  //a2280f
                        col=='shade3' ? '#d19662' :  //7e4a1d ..
                        // col=='shade5' ? '#addd8e' :  //55a323
                        // col=='shade6' ? '#31a354' :  //0d5624
                        col=='shade4' ? '#428b67' :  //1b5237
                                       '#0a0b0c' ;  //3c3c3c

                    });

                    $rootScope.indicators.forEach( function(item, index) {
                        item.schoolRankColor = colors[index];
                    });
                    // vm.ranks[index] = response.data;
                });
            }

            vm.activeSchoolId = vm.schoolid.data;
        }

        function getClassGroup(classGroup){
             switch(classGroup){
                case(0):
                    return 'Pre Primary';
                    break;
                case(5):
                    return 'Primary';
                    break;
                case(8):
                    return 'VI - VIII';
                    break;
                case(9):
                    return 'IX';
                    break;
                case(10):
                    return 'X';
                    break;
                case(11):
                    return 'XI';
                    break;
                case(12):
                    return 'XII';
                    break;
            };
        }

        function getSCRBar(schoolid, index){
            AnalysisService.getGraph(schoolid).then(function(response){
                var define = [
                    ['CLASS', 'SCR',{role:'style'}, {'role': 'tooltip', 'p': {'html': true}}]
                ];

                response.data.forEach(function(item,j){
                    var classGroup = getClassGroup(item.classGroup);
                    if(item.SCR){
                        define.push([classGroup,item.SCR,item.type,'<div style="padding: 5px; width:90px;"><strong>'+classGroup+'<br>SCR:</strong> '+item.SCR+'<br>'+'<strong>Classrooms:</strong> '+item.classes+'</div>']);
                    }
                });

                vm['myChartObject'+index] = {};
                vm['myChartObject'+index].type = "BarChart";
                vm['myChartObject'+index].data = define;
                vm['myChartObject'+index].options={
                    title:'Student Classroom Ratio: 2015',
                    height: vm.chartHeight,
                    width: vm.chartWidth,
                    hAxis: {minValue: 0},
                    tooltip: {isHtml: true}
                }
                vm.loadingCharts = false;
            });
        }

        function getSCRLine(schoolid, index){
            AnalysisService.getSCRLine(schoolid).then(function(response){
                var item = response.data[0];
                var getSCRToolTip = function(year){
                    return '<div style="padding: 5px; width:90px;"><strong>'+year+'<br>SCR:</strong>'+item['SCR'+year]+'<br>'+'<strong>Classrooms:</strong> '+item['classes'+year]+'</div>';
                };
                var define = [
                    ['Year', 'SCR',{role:'style'}, {'role': 'tooltip', 'p': {'html': true}}],
                    ['2012', item.SCR2012 , 'opacity: 0.6',getSCRToolTip(2012)],
                    ['2013', item.SCR2013, 'opacity: 0.6',getSCRToolTip(2013)],
                    ['2014', item.SCR2014, 'opacity: 0.6',getSCRToolTip(2014)],
                    ['2015', item.SCR2015, 'opacity: 0.6',getSCRToolTip(2015)]
                ];

                vm['myChart1Object'+index] = {};
                vm['myChart1Object'+index].type = "LineChart";
                vm['myChart1Object'+index].data = define;
                vm['myChart1Object'+index].options={
                    title:'Student Classroom Ratio: 2015',
                    height: vm.chartHeight,
                    width: vm.chartWidth,
                    vAxis: {minValue: 0},
                    tooltip: {isHtml: true}
                }
                vm.loadingCharts = false;
            });
        }



        function getDropChart(schoolid, index){
             AnalysisService.getSchoolDropouts(schoolid).then(function(response){
                vm['myChartObject'+index] = {};
                vm['myChartObject'+index].type = "PieChart";
                vm['myChartObject'+index].data = [
                    ['Class', 'Dropouts']
                ];
                
                response.data.forEach(function(item,j){
                    if(item.NSO2016){
                        vm['myChartObject'+index].data.push([item.class_desc,item.NSO2016]);
                    }
                });

                vm['myChartObject'+index].options = {
                    title:'Dropout Count: 2016',
                    height: vm.chartHeight,
                    width: vm.chartWidth
                };
                vm.loadingCharts = false;
            });
         }

        function getDrop1Chart(schoolid, index){
             AnalysisService.getSchoolDropouts(schoolid).then(function(response){
                vm['myChart1Object'+index] = {};
                vm['myChart1Object'+index].type = "LineChart";
                vm['myChart1Object'+index].data = [
                    ['Class', 'Dropouts']
                ];
                
                response.data.forEach(function(item,j){
                    if(item.NSO2016){
                        vm['myChart1Object'+index].data.push([item.class_desc,item.NSO2016]);
                    }
                });

                vm['myChart1Object'+index].options = {
                    title:'Dropout Count (Historical): 2012-2016',
                    height: vm.chartHeight,
                    width: vm.chartWidth,
                    vAxis: {minValue: 0}
                };
            });
         }


        function getTeacherAttendanceChart(schoolid, index){
             AnalysisService.getTeacherAttendanceChart(schoolid).then(function(response){
                vm['myChartObject'+index] = {};
                 var g1=0,g2=0,g3=0,g4=0;
                vm['myChartObject'+index].type = "BarChart";
                 response.data.forEach(function(item,index){
                     item.attendance>=80?g1++:item.attendance<80 && item.attendance>=60 ?g2++:
                         item.attendance<60 && item.attendance>=40 ?g3++:
                     item.attendance<40?g4++:0;
                 });

                 vm['myChartObject'+index].data = [
                    ['Range','Employees', { role: 'style' } ],
                    ['>80%',g1, 'fill-color: #C5A5CF'],
                    ['60-80%',g2, 'fill-color: #C5A5CF'],
                    ['40-60%',g3, 'fill-color: #C5A5CF'],
                    ['<40%',g4, 'fill-color: #C5A5CF']
                ];

                vm['myChartObject'+index].options = {
                    title:'Teacher Attendance: Last 30 Working Days',
                    height: vm.chartHeight,
                    width: vm.chartWidth,
                    hAxis: {minValue: 0}
                }
                vm.loadingCharts = false;
             });
        }

        function getPastTeacherAttendanceChart(schoolid, index){
         AnalysisService.getPastTeacherAttendanceChart(schoolid).then(function(response){
            vm['myChart1Object'+index] = {};
            vm.myChart1Object1.type = "LineChart";
            var months=['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            vm['myChart1Object'+index].data = [
                ['Month','Attendance', { role: 'style' } ],
                [months[response.data[0]['att_month']],response.data[0]['Attendance'], 'fill-color: #C5A5CF'],
                [months[response.data[1]['att_month']],response.data[1]['Attendance'], 'fill-color: #C5A5CF'],
                [months[response.data[2]['att_month']],response.data[2]['Attendance'], 'fill-color: #C5A5CF'],
                [months[response.data[3]['att_month']],response.data[3]['Attendance'], 'fill-color: #C5A5CF'],
                [months[response.data[4]['att_month']],response.data[4]['Attendance'], 'fill-color: #C5A5CF'],
                [months[response.data[5]['att_month']],response.data[5]['Attendance'], 'fill-color: #C5A5CF']
            ];

            vm.myChart1Object1.options = {
                title:'Average % Teacher Attendance (Historical): Last 6 months',
                height: vm.chartHeight,
                width: 800,
                vAxis: {minValue: 0}
            }
            vm.loadingCharts = false;
         });
        }


        function getLowTeacherAttendanceChart(schoolid, index){

            AnalysisService.getTeacherAttendanceChart(schoolid).then(function(response){
            var data=[];

            response.data.forEach(function(item,index){

                data.push({"empid":item.empid,"Attendance %":item.attendance});
            });


            var columnDefs = [{'field': 'empid'}, {'field': 'Attendance %'}];

            $scope['gridOpts'+index] = {
                data: data,
                enableFiltering: true,
                columnDefs: columnDefs,
                onRegisterApi: function(gridApi) {
                    $scope.gridApi = gridApi;
                }
            };

                });
        }            

        function getStudentAttendanceChart(schoolid, index){
            // AnalysisService.getStudentAttendanceChart(schoolid).then(function(response){
                vm['myChartObject'+index] = {};
                vm['myChartObject'+index].type = "BarChart";
                vm['myChartObject'+index].data = [
                    ['Range', 'Attendance', { role: 'style' } ],
                    ['>80%', 70, 'color: #76A7FA'],
                    ['60-80%', 84, 'color: #76A7FA'],
                    ['40-60%', 66, 'color: #76A7FA'],
                    ['<40%', 90, 'color: #76A7FA'],
                ];

                vm.StudentAttendancedata = vm['myChartObject'+index].data;
                vm['myChartObject'+index].options = {
                    title:'Student Attendance: Last 30 Working Days',
                    height: vm.chartHeight,
                    width: vm.chartWidth
                }
                vm.loadingCharts = false;
            // });
        }

 // function getGTRChart(schoolid, index){
 //            // AnalysisService.getStudentAttendanceChart(schoolid).then(function(response){
 //                vm['myChartObject'+index] = {};
 //                vm['myChartObject'+index].type = "BarChart";
 //                vm['myChartObject'+index].data = [
 //                    ['Subject', 'TGT', 'PGT', 'KGT'],
 //                    ['English', 100, 40, 20],
 //                    ['Hindi', 117, 46, 25],
 //                    ['Science', 66, 112, 30],
 //                    ['Social Studies', 103, 54, 35],
 //                    ['Computers', 87, 46, 75],
 //                    ['Punjabi', 97, 76, 75]
 //                ];
 //
 //                vm['myChartObject'+index].options = {
 //                    title:'Guest Teacher Ratio: 2016',
 //                    height: vm.chartHeight,
 //                    width: vm.chartWidth
 //                 }
 //             // });
 //         }


        function getGTRChart(schoolid, index) {
            AnalysisService.getGTRChart(schoolid).then(function (response) {
                // vm.ranks[index] = Math.round(Math.random(1)*1000);
                vm['myChartObject' + index] = {};
                vm.myChartObject3.type = "PieChart";
                var define=[
                  ['Subject', 'Pre-Primary']
                ];

                response.data.forEach(function(item,index){
                    define.push([item['postgroup'],item['GTR2016']]);
                });

                vm['myChartObject' + index].data=define;

                vm['myChartObject' + index].options = {
                    title: 'Post wise guest teacher ratio: 2016',
                    height: vm.chartHeight,
                    width: vm.chartWidth
                }
            vm.loadingCharts = false;
            });
        }

        function getGTR1Chart(schoolid, index) {
            AnalysisService.getGTR1Chart(schoolid).then(function (response) {
                    // vm.ranks[index] = Math.round(Math.random(1)*1000);
                    vm['myChart1Object' + index] = {};
                    vm.myChart1Object3.type = "PieChart";
                    vm['myChart1Object' + index].data = [
                        ['Subject', 'Pre-Primary'],
                        ['Regular Teachers', response.data[0]['Regular2016']],
                        ['Guest Teachers', response.data[0]['GTR2016']]
                    ];

                    vm['myChart1Object' + index].options = {
                        title: 'Teacher Distribution: 2016',
                        height: vm.chartHeight,
                        width: vm.chartWidth
                    }
                vm.loadingCharts = false;
            });
        }

        function getPastStudentAttendanceChart(schoolid, index){
            // AnalysisService.getStudentAttendanceChart(schoolid).then(function(response){
                vm['myChart1Object'+index] = {};
                vm.myChart1Object2.type = "LineChart";
                vm['myChart1Object'+index].data = [
                ['Year', '% Attendance', { role: 'style' } ],
                ['Jan', 80, 'opacity: 0.6'],
                ['Feb', 70, 'opacity: 0.6'],
                ['Mar', 75, 'opacity: 0.6'],
                ['Apr', 85, 'opacity: 0.6'],
                ['Jun', 75, 'opacity: 0.6'],
                ['Jul', 77, 'opacity: 0.6'],
            ];

                vm['myChart1Object'+index].options = {
                    title:'Average % Student Attendance (Historical): Last 6 months',
                    height: vm.chartHeight,
                    width: vm.chartWidth,
                    vAxis: {minValue: 0}
                }
            vm.loadingCharts = false;
            // });
        }

        function getStudentLowAttn(schoolid, index){
            var data = [{
                "Grade": "VIII",
                "Attendance": 40,
                "Teacher": "Ram",
            },
            {
                "Grade": "X",
                "Attendance": 50,
                "Teacher": "Jill",
            },
            {
                "Grade": "XII",
                "Attendance": 60,
                "Teacher": "Sham",
            }];

            var columnDefs = [{'field': 'Grade'}, {'field': 'Attendance'}, {'field': 'Teacher'}];

            $scope['gridOpts'+index] = {
                data: data,
                enableFiltering: true,
                columnDefs: columnDefs,
                onRegisterApi: function(gridApi) {
                    $scope.gridApi = gridApi;
                }
            };
        }    

        // function getGTRChart(schoolid, index){
        //     // AnalysisService.getStudentAttendanceChart(schoolid).then(function(response){
        //         vm['myChartObject'+index] = {};
        //         vm['myChartObject'+index].type = "BarChart";
        //         vm['myChartObject'+index].data = [
        //             ['Subject', 'TGT', 'PGT', 'KGT'],
        //             ['English', 100, 40, 20],
        //             ['Hindi', 117, 46, 25],
        //             ['Science', 66, 112, 30],
        //             ['Social Studies', 103, 54, 35],
        //             ['Computers', 87, 46, 75],
        //             ['Punjabi', 97, 76, 75]
        //         ];
        //
        //         vm['myChartObject'+index].options = {
        //             title:'Guest Teacher Ratio: 2016',
        //             height: vm.chartHeight,
        //             width: vm.chartWidth
        //         }
        //     // });
        // }



        function getCARRChart(schoolid, index){
            AnalysisService.getCAR(schoolid).then(function(response){

                vm['myChartObject'+index] = {};
                vm['myChartObject'+index].type = "PieChart";
                vm['myChartObject'+index].data = [
                    ['Year', 'CARR', { role: 'style' } ],
                    ['Classrooms', response.data[0].classes2015, 'fill-color: #C5A5CF'],
                    ['Other Rooms', response.data[0].others2015, 'opacity: 0.6']
                ];

                vm['myChartObject'+index].options = {
                    title:'Room Utilization: 2015',
                    height: vm.chartHeight,
                    width: vm.chartWidth
                }
                vm.loadingCharts = false;
            });
        }

        function getQIChart(schoolid, index){
             AnalysisService.getSchoolQI(schoolid).then(function(response){
                var item = response.data;
                var QI10 = item[0]?item[0].QI2016:0;
                var QI12 = item[1]?item[1].QI2016:0;

                var define = [
                    ['CLASS', 'QI',{role:'style'}],
                    ['X', QI10 ,'opacity: 0.6'],
                    ['XII', QI12 ,'opacity: 0.6'],
                ];


                vm['myChartObject'+index] = {};
                vm['myChartObject'+index].type = "BarChart";
                vm['myChartObject'+index].data = define;
                vm['myChartObject'+index].options={
                    title:'Student Classroom Ratio: 2016',
                    height: vm.chartHeight,
                    width: vm.chartWidth,
                    hAxis: {minValue: 0}
                }
            });
        } 

        function getQI1Chart(schoolid, index){
            AnalysisService.getSchoolQI(schoolid).then(function(response){
                vm['myChart1Object'+index] = {};
                var item = response.data;
                vm.myChart1Object5.type = "LineChart";

                var QI2012 = item[0]?item[0].QI2012:0;
                var Q12I2012 = item[1]?item[1].QI2012:0;
                var QI2013 = item[0]?item[0].QI2013:0;
                var Q12I2013 = item[1]?item[1].QI2013:0;
                var QI2014 = item[0]?item[0].QI2014:0;
                var Q12I2014 = item[1]?item[1].QI2014:0;
                var QI2015 = item[0]?item[0].QI2015:0;
                var Q12I2015 = item[1]?item[1].QI2015:0;
                var QI2016 = item[0]?item[0].QI2016:0;
                var Q12I2016 = item[1]?item[1].QI2016:0;
                vm['myChart1Object'+index].data = [
                    ['Year', 'X','XII', { role: 'style' } ],
                    ['2012', QI2012, Q12I2012, 'opacity: 0.6'],
                    ['2013', QI2013, Q12I2013, 'opacity: 0.6'],
                    ['2014', QI2014, Q12I2014, 'opacity: 0.6'],
                    ['2015', QI2015, Q12I2015, 'opacity: 0.6'],
                    ['2016', QI2016, Q12I2016, 'opacity: 0.6']
                ];

                vm['myChart1Object'+index].options = {
                    title:'Quality Index (Historical): 2012-2016',
                    height: vm.chartHeight,
                    width: vm.chartWidth,
                    vAxis: {minValue: 0}
                    }
             });
        }     


         function getVacChart(schoolid, index){
              AnalysisService.getVacChart(schoolid).then(function(response){
                vm['myChartObject'+index] = {};
                vm['myChartObject'+index].type = "PieChart";
                vm['myChartObject'+index].data = [
                    ['Filled', 'Vacant'],
                    ['Filled',response.data[0]['TotalFill']],
                    ['Vacant',response.data[0]['Vacant2016']],
                ];

                vm['myChartObject'+index].options = {
                    title:'Teacher Vacancy by School: 2016',
                    height: vm.chartHeight,
                    width: vm.chartWidth
                }
             });
        }



        function getVac1Chart(schoolid, index){
             {
                 AnalysisService.getVac1Chart(schoolid).then(function(response){
                    // vm.ranks[index] = Math.round(Math.random(1)*1000);
                    vm['myChart1Object'+index] = {};
                     var define = [
                         ['Vacant Post', Number]
                     ];

                    vm.myChart1Object7.type = "PieChart";
                     response.data.forEach(function(item,index){
                         define.push([item['postgroup'],item['Vacant2016']]);
                     });

                    vm['myChart1Object'+index].data = define;

                    vm['myChart1Object'+index].options = {
                        title:'Teacher Vacancy by Post: 2016',
                        height: vm.chartHeight,
                        width: vm.chartWidth
                    }
                    vm.loadingCharts = false;
                });
            }
        }



        function getAadharChart(schoolid,index) {
             {
                AnalysisService.getAadharChart(schoolid).then(function (response) {
                    vm['myChart2Object' + index] = {};
                    vm['myChart2Object' + index].type = "BarChart";
                    var define = [
                        ['Class', 'Total Students', 'Aadhaar Enrolments']
                    ];

                    console.log("grade wise",response.data);
                    response.data.forEach(function (item, index) {
                        define.push([item['class_desc'], item['totalStudents2016'], item['aadharCard2016']]);
                    });

                    vm['myChart2Object' + index].data=define;

                    vm['myChart2Object' + index].options = {
                        title: 'Aadhaar Enrolments by Grade: 2016',
                        height: vm.chartHeight,
                        width: vm.chartWidth
                    }
                    vm.loadingCharts = false;
                });
            }
        }

        function getBank1Chart(schoolid, index){
            // AnalysisService.getStudentAttendanceChart(schoolid).then(function(response){
            vm['myChart1Object'+index] = {};
            vm.myChart1Object8.type = "PieChart";
            vm['myChart1Object'+index].data = [
                ['Class', 'Total Students'],
                ['Enrolled', 100],
                ['Pending', 117],
            ];
    
             vm['myChartObject'+index].data = define;
    
             vm['myChartObject'+index].data = [
            
            
                ['VI', 100, 40],
                ['VII', 117, 46],
                ['VIII', 136, 112],
                ['IX', 103, 54],
                ['X - Med.', 87, 46],
                ['X - Comm.', 97, 76]
            ];
    
            vm['myChartObject'+index].options = {
                title:'Aadhaar Enrollments by Grade: 2016',
                height: vm.chartHeight,
                width: vm.chartWidth
            }
    
         }

        function getAadhar1Chart(schoolid, index){
            AnalysisService.getAadhar1Chart(schoolid).then(function(response){
                vm['myChart1Object'+index] = {};
                vm['myChart1Object'+index].type = "PieChart";
                vm['myChart1Object'+index].data = [
                    ['Class', 'Total Students'],
                    ['Enrolled', response.data[0]['Enrolled']],
                    ['Pending', response.data[0]['Pending']],
                ];

                vm['myChart1Object'+index].options = {
                    title:'Overall Aadhaar Enrolments: 2016',
                    height: vm.chartHeight,
                    width: vm.chartWidth,
                    hAxis: {minValue: 0}
                }
                vm.loadingCharts = false;
            });
        }    

        // function getPtr1Chart(schoolid, index){
        //     // AnalysisService.getStudentAttendanceChart(schoolid).then(function(response){
        //         vm['myChart1Object'+index] = {};
        //         vm['myChart1Object'+index].type = "BarChart";
        //         vm['myChart1Object'+index].data = [
        //             ['Class', 'Morning', 'Evening'],
        //             ['TGT', 30, 40],
        //             ['PGT', 25, 36],
        //             ['KGT', 36, 32],
        //             ];
        //
        //         vm['myChart1Object'+index].options = {
        //             title:'Pupil Teacher Ratio by Level: 2016',
        //             height: vm.chartHeight,
        //             width: vm.chartWidth
        //         }
        //     // });
        // 

        function getPtrChart(schoolid, index){
             AnalysisService.getPTRChart(schoolid).then(function(response){
                vm['myChartObject'+index] = {};
                vm.myChartObject9.type = "BarChart";
                var define=[
                    ['Class','PTR']
                ];
                 console.log(response.data);

                response.data.forEach(function(item,index){

                    define.push([item['Class'],item['PTR']]);

                })
                vm['myChartObject'+index].data = define;

                vm['myChartObject'+index].options = {
                    title:'Pupil Teacher Ratio by level: 2016',
                    height: vm.chartHeight,
                    width: vm.chartWidth,
                    hAxis: {minValue: 0}
                }
                vm.loadingCharts = false;
             });
        }

        function getBankEnrChart(schoolid, index){
             AnalysisService.getBankEnrChart(schoolid).then(function(response){
                vm['myChartObject'+index] = {};
                vm['myChartObject'+index].type = "PieChart";
                 console.log(response.data);
                vm['myChartObject'+index].data = [
                    ['Class', 'Total Students'],
                    ['Enrolled', response.data[0]['Enrolled']],
                    ['Pending', response.data[0]['Pending']],
                ];

                vm['myChartObject'+index].options = {
                    title:'Overall Bank Account Enrolments: 2016',
                    height: vm.chartHeight,
                    width: vm.chartWidth
                }
                vm.loadingCharts = false;
             });
        }

        function getBankEnr1Chart(schoolid, index){
            AnalysisService.getBankEnr1Chart(schoolid).then(function (response) {
                vm['myChart1Object' + index] = {};
                vm['myChart1Object' + index].type = "BarChart";

                var define = [
                    ['Class', 'Total Students', 'Bank Enrollments']
                ];

                response.data.forEach(function (item, index) {
                    define.push([item['class_desc'], item['totalStudents2016'], item['bankAcc2016']]);
                });

                vm['myChart1Object' + index].data=define;

                vm['myChart1Object' + index].options = {
                    title: 'Bank Enrolments by Grade: 2016',
                    height: vm.chartHeight,
                    width: vm.chartWidth,
                    hAxis: {minValue: 0}
                }
                vm.loadingCharts = false;
            });
        }

        function getAserHindiChart(schoolid, index){
             AnalysisService.getAserHindi(schoolid).then(function(response){
                vm['myChartObject'+index] = {};
                vm['myChartObject'+index].type = "BarChart";
                var item = response.data;
                var count = [0,0,0,0,0,0];                
                item.forEach(function(item,index){
                    count[item.score] = item.count;
                });

                vm['myChartObject'+index].data = [
                    ['Score', 'Number of Students' ],
                    ['One', count[0]],
                    ['Two', count[1]],
                    ['Three', count[2]],
                    ['Four', count[3]],
                    ['Five', count[4]],
                    ['Six', count[5]]
                    ];

                vm['myChartObject'+index].options = {
                    title:'Number of Students per Score: 2016',
                    height: vm.chartHeight,
                    width: vm.chartWidth,
                    hAxis: {minValue: 0}
                }
                vm.loadingCharts = false;
             });
        }

        function getAserEngChart(schoolid, index){
            AnalysisService.getAserEnglish(schoolid).then(function(response){
                vm['myChartObject'+index] = {};
                vm['myChartObject'+index].type = "BarChart";
                var item = response.data;
                
                var count = [0,0,0,0,0];                
                item.forEach(function(item,index){
                    count[item.score] = item.count;
                });
            
                vm['myChartObject'+index].data = [
                    ['Score', 'Number of Students' ],
                    ['One', count[0]],
                    ['Two', count[1]],
                    ['Three', count[2]],
                    ['Four', count[3]],
                    ['Five', count[4]]
                    ];

                vm['myChartObject'+index].options = {
                    title:'Number of Students per Score: 2016',
                    height: vm.chartHeight,
                    width: vm.chartWidth,
                    hAxis: {minValue: 0}
                }
                vm.loadingCharts = false;
            });
        } 

        function getAserMathChart(schoolid, index){
            AnalysisService.getAserMaths(schoolid).then(function(response){
                vm['myChartObject'+index] = {};
                vm['myChartObject'+index].type = "BarChart";
                var item = response.data;

                var count = [0,0,0,0,0];                
                item.forEach(function(item,index){
                    count[item.score] = item.count;
                });

                vm['myChartObject'+index].data = [
                    ['Score', 'Number of Students' ],
                    ['One', count[0]],
                    ['Two', count[1]],
                    ['Three', count[2]],
                    ['Four', count[3]],
                    ['Five', count[4]]
                    ];

                vm['myChartObject'+index].options = {
                    title:'Number of Students per Score: 2016',
                    height: vm.chartHeight,
                    width: vm.chartWidth,
                    hAxis: {minValue: 0}
                }
                vm.loadingCharts = false;
            });
        }         
    
        function getToiletChart(schoolid, index){
            AnalysisService.getSTR(schoolid).then(function(response){
                vm['myChartObject'+index] = {};
                vm['myChartObject'+index].type = "BarChart";
                var item = response.data[0];
                vm['myChartObject'+index].data = [
                    ['Score', 'Number of Students' ],
                    ['Boys', item.STR2015B],
                    ['Girls', item.STR2015G]
                    ];

                vm['myChartObject'+index].options = {
                    title:'Number of Students per Score: 2015',
                    height: vm.chartHeight,
                    width: vm.chartWidth,
                    hAxis: {minValue: 0}
                }
                vm.loadingCharts = false;
            });
        }

        function getCCEChart(schoolid, index){
            AnalysisService.getCCEChart(schoolid).then(function (response) {
                vm['myChartObject' + index] = {};
                vm['myChartObject' + index].type = "BarChart";

                var define = [
                    ['Class', 'Average CCE2016','Average CCE2015']
                ];

                console.log(response.data);
                response.data.forEach(function (item, index) {
                    define.push([item['classid'], item['CCE2016'],item['CCE2015']]);
                });


                vm['myChartObject' + index].data = define;

                vm['myChartObject' + index].options = {
                    title: 'CCE per class : 2016',
                    height: vm.chartHeight,
                    width: vm.chartWidth,
                    hAxis: {minValue: 0}
                }
                vm.loadingCharts = false;
            });
        }

        function getMarksChart(schoolid, index){
            AnalysisService.getMarksChart(schoolid).then(function(response){
                var define = [
                    ['Class', 'Pass']
                ];

                response.data.forEach(function (item, index) {
                    define.push([item['classid'], item['pass']]);
                });
                vm['myChartObject'+index] = {};
                vm['myChartObject'+index].type = "BarChart";
                vm['myChartObject'+index].data = define;

                vm['myChartObject'+index].options = {
                    title:'Pass % per class : 2016',
                    height: vm.chartHeight,
                    width: vm.chartWidth,
                    hAxis: {minValue: 0}
                }
                vm.loadingCharts = false;
            });
        }


        // function getCceChart(schoolid, index){
        //     if (!vm['myChartObject'+index] || index) {
        //     // AnalysisService.getStudentAttendanceChart(schoolid).then(function(response){
        //         vm.ranks[index] = Math.round(Math.random(1)*1000);
        //         vm['myChartObject'+index] = {};
        //         vm['myChartObject'+index].type = "BarChart";
        //         vm['myChartObject'+index].data = [
        //             ['Grade', 'Average CCE - 2016', 'Average CCE - 2015' ],
        //             ['VI', 30, 20],
        //             ['VII', 25, 20],
        //             ['VIII', 35, 40],
        //             ['IX', 20, 30],
        //             ['X', 25, 30],
        //             ['XI', 35, 20],
        //             ['XII', 25, 30],
        //             ];
        //
        //         vm['myChartObject'+index].options = {
        //             title:'Average CCE Score by Grade: 2016',
        //             height: vm.chartHeight,
        //             width: vm.chartWidth
        //         }
        //     // });
        //     }
        // }

        // function getCce1Chart(schoolid, index){
        //     if (!vm['myChart1Object'+index] || index) {
        //     // AnalysisService.getStudentAttendanceChart(schoolid).then(function(response){
        //         vm['myChart1Object'+index] = {};
        //         vm['myChart1Object'+index].type = "BarChart";
        //         vm['myChart1Object'+index].data = [
        //             ['Grade', 'Average CCE - 2016', 'Average CCE - 2015' ],
        //             ['Hindi', 30, 20],
        //             ['English', 25, 20],
        //             ['Urdu', 15, 30],
        //             ['Hebrew', 30, 40],
        //             ['Science', 25, 20],
        //             ];
        //
        //         vm['myChart1Object'+index].options = {
        //             title:'Average CCE Score by Subject: 2016',
        //             height: vm.chartHeight,
        //             width: vm.chartWidth
        //         }
        //     // });
        //     }
        // }

        function getCce2Chart(schoolid, index){
            AnalysisService.getCce2Chart(schoolid).then(function(response){
                vm['myChart2Object'+index] = {};
                vm['myChart2Object'+index].type = "LineChart";
                // // vm['myChart2Object'+index].data = [
                // //     ['Class', 'Dropouts']
                // ];


                 vm['myChart2Object'+index].data = [
                    ['Year','Score', { role: 'style' } ],
                    ['2013',response.data[0]['CCE2013'], 'fill-color: #C5A5CF'],
                    ['2014',response.data[0]['CCE2014'], 'fill-color: #C5A5CF'],
                    ['2015',response.data[0]['CCE2015'], 'fill-color: #C5A5CF'],
                    ['2016',response.data[0]['CCE2016'], 'fill-color: #C5A5CF'],
                    // ['Jun',70, 'fill-color: #C5A5CF']
                 ];


                vm['myChart2Object'+index].options = {
                    title:'Average CCE Score (Historical): 2013-2016',
                    height: vm.chartHeight,
                    width: vm.chartWidth,
                    vAxis: {minValue: 0}
                };

                vm.loadingCharts = false;
            });
        }

        function getDeskChart(schoolid, index){
            AnalysisService.getSPD(schoolid).then(function(response){
                vm['myChartObject'+index] = {};
                vm['myChartObject'+index].type = "BarChart";
                var item = response.data[0];
                vm['myChartObject'+index].data = [
                    ['Year', 'Average Students per Desk' ],
                    ['2016', item.SPD2016],
                    ['2015', item.SPD2015],
                    ['2014', item.SPD2014],
                    ['2013', item.SPD2013]
                    ];

                vm['myChartObject'+index].options = {
                    title:'Average Students per Desk: 2012-2016',
                    height: vm.chartHeight,
                    width: vm.chartWidth,
                    hAxis: {minValue: 0}
                }
                vm.loadingCharts = false;
            });
        } 

        // function getpassChart(schoolid, index){
        //     if (!vm['myChartObject'+index] || index) {
        //     // AnalysisService.getStudentAttendanceChart(schoolid).then(function(response){
        //         vm['myChartObject'+index] = {};
        //         vm['myChartObject'+index].type = "BarChart";
        //         vm['myChartObject'+index].data = [
        //             ['Grade', 'Pass Percentage 2016', 'Pass Percentage 2016' ],
        //             ['IX', 40, 30],
        //             ['X', 75, 60],
        //             ['XI', 65, 60],
        //             ['XII', 80, 60],
        //             ];
        //
        //         vm['myChartObject'+index].options = {
        //             title:'Pass % by Grade: 2016',
        //             height: vm.chartHeight,
        //             width: vm.chartWidth
        //         }
        //     // });
        //     }
        // }

        // function getpass1Chart(schoolid, index){
        //     if (!vm['myChart1Object'+index] || index) {
        //          // AnalysisService.getSchoolDropouts(schoolid).then(function(response){
        //             vm['myChart1Object'+index] = {};
        //             vm['myChart1Object'+index].type = "LineChart";
        //             vm['myChart1Object'+index].data = [
        //             ['Year','Attendance', { role: 'style' } ],
        //             ['2012',75, 'fill-color: #C5A5CF'],
        //             ['2013',80, 'fill-color: #C5A5CF'],
        //             ['2014',74, 'fill-color: #C5A5CF'],
        //             ['2015',75, 'fill-color: #C5A5CF'],
        //             ['2016',69, 'fill-color: #C5A5CF'],
        //             // ['Jun',70, 'fill-color: #C5A5CF']
        //         ];
        //
        //             vm['myChart1Object'+index].options = {
        //                 title:'Average School Result (Historical): 2012-2016',
        //                 height: vm.chartHeight,
        //                 width: vm.chartWidth
        //             };
        //         // });
        //      }
        // }
    }
})();
