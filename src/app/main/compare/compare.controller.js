(function() {
    'use strict';

    function DialogController($scope, $mdDialog, $rootScope) {
        var vm = this;
        vm.filters = [];

        init();

        function init() {
            $scope.indicators = $rootScope.indicators;
            vm.selectedIndex = 0;
            vm.filters = $rootScope.filterData[0];
            vm.makeActive = makeActive;
            vm.makeActive(0);
        }

        function makeActive(index) {
            vm.selectedIndex = index;
            vm.indicator = $rootScope.indicators[index];
            vm.filters = $rootScope.filterData[index];
        }

        $scope.addIndicator = function(filters) {
            $mdDialog.hide({"index": vm.selectedIndex, "filters" : filters});
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        }
    }

    angular
        .module('app.compare')
        .controller('CompareController', CompareController)
        .filter('formatName', function() {
            return function (input) {
                if (input.type=="zone") {
                    var str = input.id+"";
                    var districtid = str.substr(0,2);
                    var zoneid = str.substr(2,3);
                    return "Zone ID: "+zoneid+", District ID: "+districtid;
                }
                return input.id;
            }
        })

    /** @ngInject */
    function CompareController($rootScope, $log, $scope, CompareService, uiGridConstants, $http, $mdMedia, $mdDialog, SchoolService, PeopleService, AnalysisService, $mdSidenav) {
        var vm = this;
        var tableData = [];

        init();

        function init() {
            $scope.tableView = false;
            vm.switchView = switchView;
            vm.selectedItemChange = selectedItemChange;
            vm.querySearch = querySearch;
            $scope.gridOpts = {enableFiltering: true, data: [], };
            vm.showSchool = showSchool;
            $scope.showSchool = showSchool;

            $scope.highlightFilteredHeader = function(row, rowRenderIndex, col, colRenderIndex) {
                if (col.filters[0].term) {
                    return 'header-filtered';
                } else {
                    return '';
                }
            };

            $scope.stringFilters = [{
                        condition: uiGridConstants.filter.STARTS_WITH,
                        placeholder: 'Starts with'
                    }, {
                        condition: uiGridConstants.filter.CONTAINS,
                        placeholder: 'Contains'
                    }];

            $scope.numberFilters = [{
                        condition: uiGridConstants.filter.GREATER_THAN,
                        placeholder: 'Greater than'
                    }, {
                        condition: uiGridConstants.filter.LESS_THAN,
                        placeholder: 'Less than'
                    }];
        }

        function showSchool(schoolid){
            SchoolService.getSchool(schoolid);
            PeopleService.getPeople(schoolid);
            AnalysisService.getScrGraph(schoolid);
            $mdSidenav("school-sidenav").toggle();
        }

        function querySearch(query) {
            return CompareService.searcharea(query);
        }

        function selectedItemChange(item){
            if (item) {
                $scope.selectedArea = item;
            }
        }

        // CompareService.getSchoolList($scope.selectedArea).then(function(response) {
        //     $scope.gridOpts.data = response.data;
        // })


        $scope.toggleFiltering = function() {
            $scope.gridOpts.enableFiltering = !$scope.gridOpts.enableFiltering;
            $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
        };

        function getOptionsHeader(dict) {
            var query="";
            dict.filters.forEach(function(item,i) {
                item.options.forEach(function(option,j) {
                    if(option.IsIncluded){
                        query=query+"__"+item["display_name"]+"_"+option["display_name"];
                    }
                });
            });
            return query;
        }

        function formatName(name) {
            name = name.replace(/__/g, " ");
            name = name.replace(/_/g, ": ");
            return name;
        }

        $scope.showIndicatorDialog = function(ev) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
            $mdDialog.show({
                    controller: DialogController,
                    controllerAs: 'vm',
                    templateUrl: '/app/main/compare/views/dialog.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: useFullScreen
                })
                .then(function(dict) {
                    $rootScope.loadingProgress = true;

                    console.log(dict);

                    CompareService.getColumnData($scope.selectedArea, dict).then(function(response){
                        var columnData = response.data;

                        console.log(columnData);
                        
                        //a random key to separate between same indicators but different filters
                        var randNum = getOptionsHeader(dict);

                        if (columnData.length>0) {
                            var keys = Object.keys(columnData[0]);
                            keys.splice(keys.indexOf("schid"), 1);
                            columnData.forEach(function (item, index) {
                                var indexOfSchId = tableData.map(function(ele) {return ele['schid'];}).indexOf(item.schid);

                                if (indexOfSchId >-1)
                                {
                                    //schid with item is already present
                                    for (var i=0; i<keys.length; i++) {
                                        var key = keys[i];
                                        tableData[indexOfSchId][key+"__"+randNum] = item[key];
                                    }
                                }
                                else {
                                    //create a new element
                                    var ele = [];
                                    ele['schid'] = item['schid'];
                                    for (var i=0; i<keys.length; i++) {
                                        var key = keys[i];
                                        ele[key+"__"+randNum] = item[key];
                                    }
                                    tableData.push(ele);
                                }
                            });
                        }

                        function onlyUnique(value, index, self) { 
                            return self.indexOf(value) === index;
                        }

                        //find all possible keys from 

                        var cols = tableData.map(function(ele){return Object.keys(ele)}).reduce(function(a,b){return a.concat(b);}).filter(onlyUnique);
                        //.filter(onlyUnique)

                        var columnDefs = [];
                        for (var i=0; i<cols.length; i++) {
                            if (cols[i].indexOf("hashKey") == -1) {
                                var filters = [];
                                if (typeof tableData[0][cols[i]] == "number" && cols[i]!="schid")
                                    filters = angular.copy($scope.numberFilters);
                                else
                                    filters = angular.copy($scope.stringFilters);

                                var colOpts = {name: cols[i], filters: filters, width: "*", displayName: formatName(cols[i]), headerCellClass: $scope.highlightFilteredHeader};

                                if (cols[i]=="schid") {
                                    colOpts['cellTemplate']='<div class="schoolTableItem" ng-click="grid.appScope.showSchool(row.entity.schid)">{{row.entity.schid}}</div>';
                                }
                                columnDefs.push(colOpts);
                            }
                        }

                        $scope.gridOpts = {
                                data: tableData,
                                columnDefs: columnDefs,
                                enableFiltering: true,
                                onRegisterApi: function(gridApi) {
                                    $scope.gridApi = gridApi;
                                }
                        };

                        $rootScope.loadingProgress = false;
                    })
                }, function() {
                    $scope.status = 'You cancelled the dialog.';
                });
            $scope.$watch(function() {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function(wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        };

        function switchView() {
            console.log('switchView');
            $scope.tableView = true;
        }
    }
})();