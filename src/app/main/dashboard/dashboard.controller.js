(function ()
{
    'use strict';

    angular
        .module('app.dashboard')
        .controller('DashboardController', DashboardController);

    /** @ngInject */
    function DashboardController($rootScope, DashboardService, $scope, $mdSidenav, $sce, SchoolService, PeopleService, AnalysisService, $log, $http, leafletBoundsHelpers, leafletData, $mdMedia, uiGridConstants)
    {
        var vm = this;

        var zoom;
        var lng=77.10;

        if ($mdMedia('xs')) {
            zoom = 9.8;
        }
        else if ($mdMedia('sm')) {
            zoom = 10.8;
        }
        else if ($mdMedia('md')) {
            zoom = 10.5;
        }
        else {
            zoom = 10.6;
            lng = 77.04;
        }

        init();

        angular.extend($scope, {
            defaults: {
                scrollWheelZoom: false,
                touchZoom: false,
                zoomControl: true,
                dragging: true,
                doubleClickZoom: false,
                attributionControl: false,
                layers: []
            },
            tiles: {'url': ''},
            center: {
                lat: 28.645,
                lng: lng,
                zoom: zoom
            }
        });

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

        $scope.$on('leafletDirectiveMap.map.click', function(event){
            leafletData.getMap().then(function(map){
                removeAllMarkers(map);
                map.setView([28.645,lng], zoom);
            });

            vm.schoolData = getSchoolsForAZone(-1);
            updateSchoolList(vm.schoolData);
            setZoneInformation();
        });


        $http.get("/assets/zones.geojson", {cache: true}).success(function(data, status) {
            vm.geodata = data;
            resetLayers(function(feature){return '#0a020e';});
            $rootScope.loadingProgress = false;
        });

        function init(){
            $rootScope.loadingProgress = true;

            vm.index = 0;
            vm.markers = [];
            vm.numSchools = "";
            vm.divisions = [];
            vm.filters = [];

            vm.toggleStar = toggleStar;
            vm.showSchool = showSchool;
            $scope.showSchool = showSchool;
            
            vm.changeIndicator = changeIndicator;
            vm.processIndicator = processIndicator;

            vm.firstLegend = ">";
            vm.lastLegend = "<";

            if ($rootScope.indicators) {
                vm.indicator = $rootScope.indicators[vm.index]["dbKey"];
            }

            if ($rootScope.filterData) {
                vm.filters = $rootScope.filterData[0];
            }

            $rootScope.$on('indicatorsLoaded', function(event, data){
                vm.indicator = $rootScope.indicators[vm.index]["dbKey"];
            })

            $rootScope.$on('filtersLoaded', function(event, data) {
                vm.filters = $rootScope.filterData[0];
            })

            vm.toggleSchoolList = toggleSchoolList;
//                setSlider(0,100,2015);
            getInsights();
            getMapDivs();

            //TODO : BUG : getReportingData calls getSchoolsFromAZone which uses vm.filters which are sometiemes not set. Similarly, there may be other dependency related errors
            /// What is the solution?>>A process function outside init() called as a callback when init is done fetching data.<<
            getReportingData();
        }

        function setSlider(min,max,sel){
            vm.sliderMin = min;
            vm.sliderMax = max;            
            vm.selectedYear = sel;
        }

        function getWhereClause() {
            var query = "";
            var i_count = 0;
            var j_count = 0;

            vm.filters.forEach(function(item,i){
                item.options.forEach(function(option,j){
                    if(option.IsIncluded){
                        if (j_count>0)
                            query=query+" or ";

                        if (i_count>0 && j_count==0)
                            query=query+") and ";

                        if (j_count==0)
                            query=query+"(";

                        var quote='';
                        if (typeof option.value=="string")
                            quote='"';

                        query=query+item.value+'='+quote+option.value+quote;

                        i_count=i_count+1;
                        j_count=j_count+1;
                    }
                });
                j_count=0;
            });

            if (i_count>0)
                query = " WHERE "+query+")";

            return query;
        }

        function getShadeFromValue(row)
        {
            var operator = vm.mapDivs[vm.index]["sort"];
            var comparator;
            var shade;

            if (operator == "asc") {
                comparator = function(a, b) { return a <= b };
            }
            else {
                comparator = function(a, b) { return a >= b };
            }
            var value = row[vm.indicator];

            if(comparator(value,vm.divisions[0])) {
                shade="shade7";
            }
            else if(comparator(vm.divisions[0],value) && comparator(value,vm.divisions[1])) {
                shade="shade6";
            }
            else if(comparator(vm.divisions[1],value) && comparator(value,vm.divisions[2])) {
                shade="shade5";
            }
            else if(comparator(vm.divisions[2],value) && comparator(value,vm.divisions[3])) {
                shade="shade4";
            }
            else if(comparator(vm.divisions[3],value) && comparator(value,vm.divisions[4])) {
                shade="shade3";
            }
            else if(comparator(vm.divisions[4],value) && comparator(value,vm.divisions[5])) {
                shade="shade2";
            }
            else if(comparator(vm.divisions[5],value)) {
                shade="shade1";
            }
            else {
                shade="shade8";
            }
            return shade;
        }

        function toggleSchoolList() {
            $mdSidenav('school-list-sidenav').toggle();
        }

        function computeIndicatorQuery() {
            var query;
            switch (vm.index) {
                case 0:
                /*INCOMPLETE*/
                    query = 'ROUND(SUM('+vm.indicator+vm.selectedYear+'*classes'+vm.selectedYear+')/SUM(classes'+vm.selectedYear+'), 1) as '+vm.indicator;
                    break;
                case 1:
                    query = 'ROUND(SUM('+vm.indicator+vm.selectedYear+')/COUNT(empid), 1) as '+vm.indicator;
                    break;
                case 2:
                    query = 'ROUND(SUM('+vm.indicator+vm.selectedYear+')/SUM(weight)*10/3, 1) as '+vm.indicator;
                    break;
                case 3:
                    query = 'ROUND((case when sum('+vm.indicator+vm.selectedYear+'+Regular2016)=0 then 0 else sum('+vm.indicator+vm.selectedYear+')*100/nullif(SUM(Regular2016+'+vm.indicator+vm.selectedYear+'),0) end),1) as '+vm.indicator;
                    break;
                case 4:
                    query = 'ROUND(SUM(others'+vm.selectedYear+')*100/(SUM('+vm.indicator+vm.selectedYear+')+SUM(others'+vm.selectedYear+')), 1) as '+vm.indicator;
                    break;
                case 5:
                    query = 'ROUND(SUM('+vm.indicator+vm.selectedYear+'*weight'+vm.selectedYear+')/SUM(weight'+vm.selectedYear+'), 1) as '+vm.indicator;
                    break;
                case 6:
                    query =  query = 'ROUND(SUM('+vm.indicator+vm.selectedYear+'*100)/SUM(weight'+vm.selectedYear+'), 1) as '+vm.indicator;
                    break;
                case 7:
                    query = 'ROUND((case when sum('+vm.indicator+vm.selectedYear+')*100/sum(sanctioned) <0 then 0 else sum('+vm.indicator+vm.selectedYear+')*100/sum(sanctioned) end), 1) as '+vm.indicator;
                    break;
                case 8:
                    query = 'ROUND(SUM('+vm.indicator+vm.selectedYear+')*100/SUM(totalStudents'+vm.selectedYear+'), 1) as '+vm.indicator;
                    break;
                case 9:
                    query = 'ROUND(avg('+vm.indicator+vm.selectedYear+'), 1) as '+vm.indicator;
                    break;
                case 10:
                    query = 'ROUND(SUM('+vm.indicator+vm.selectedYear+')*100/SUM(totalStudents'+vm.selectedYear+'), 1) as '+vm.indicator;
                    break;
                case 11:
                    query = 'ROUND(avg('+vm.indicator+vm.selectedYear+'),1) as '+vm.indicator;
                    break;
                case 12:
                    query = 'ROUND(avg('+vm.indicator+vm.selectedYear+'),1) as '+vm.indicator;
                    break;
                case 13:
                    query = 'ROUND(avg('+vm.indicator+vm.selectedYear+'),1) as '+vm.indicator;
                    break;
                case 14:
                    query = 'ROUND(avg('+vm.indicator+vm.selectedYear+'),1) as '+vm.indicator;
                    break;
                case 15:
                    query = 'ROUND(avg('+vm.indicator+vm.selectedYear+'),1) as '+vm.indicator;
                    break;
                case 16:
                    query = 'ROUND(SUM(weight'+vm.selectedYear+')/SUM(Desks'+vm.selectedYear+'),1) as '+vm.indicator;
                    break;
                case 17:
                    query = 'ROUND(sum('+vm.indicator+vm.selectedYear+')/count(schid),1) as '+vm.indicator;
                    break;
            }
            return query;
        }

        function updateSchoolList(schoolData) {
            var keys = Object.keys(schoolData[0]);
            var columnDefs = [];

            keys.forEach( function(item, index) {
                if (item!="latitude" && item!="longitude") {
                    if (typeof schoolData[0][item] == "number" && item!="school") {
                        columnDefs.push({field: item, filters: angular.copy($scope.numberFilters)});
                    }
                    else {
                        columnDefs.push({field: item,
                            filters: angular.copy($scope.stringFilters),
                            cellTemplate:'<div class="schoolTableItem" ng-click="grid.appScope.showSchool(row.entity.school)">{{row.entity.school}}</div>'
                        })
                    }
                }
            });

            $scope.test = function () {
                console.log ("fuck yeah");
            }

            $scope.gridOpts = {
                data: schoolData,
                columnDefs: columnDefs,
                enableFiltering: true,
                onRegisterApi: function(gridApi) {
                    $scope.gridApi = gridApi;
                }
            };            
        }

        function updateSchoolData() {
            vm.schoolData = getSchoolsForAZone(-1);
            updateSchoolList(vm.schoolData);
            // vm.schoolDisplayData = [].concat(vm.schoolData);

            if (vm.schoolData)
                vm.numSchools = vm.schoolData.length;
        }

        function processIndicator() {
            var query = 'select zoneid, '+computeIndicatorQuery()+' from ?'+getWhereClause()+' group by zoneid';
            var zoneData = alasql(query, [vm.reportingData]);
            vm.zoneData = zoneData;
            setZoneInformation();

            resetLayers(getColor);
            updateSchoolData();
        }

        function averageScore() {
            var query = 'select '+computeIndicatorQuery()+' from ?'+getWhereClause();
            return alasql(query, [vm.reportingData])[0][vm.indicator]
        }

        function getSchoolsForAZone(zoneid) {
            var whereZone="";
            if (zoneid!=-1)
                whereZone = 'zoneid='+zoneid;

            var where="";
            if(getWhereClause()){
                where=getWhereClause();
            }

            var connector="";

            if (whereZone!="") {
             if (where=="")
                connector=" WHERE ";
             else
                connector=" AND ";
            }

            var orderBy = "";
            if ($rootScope.indicators[vm.index]["orderBy"])
                orderBy = " "+$rootScope.indicators[vm.index]["orderBy"];

            var query = 'select schid as school, FIRST(latitude) as latitude, FIRST(longitude) as longitude, '+computeIndicatorQuery()+' from ? '+where+connector+whereZone +' group by schid order by '+vm.indicator+orderBy;
            return alasql(query,[vm.reportingData]);
        }

        function showSchool(schoolid){
            SchoolService.getSchool(schoolid);
            PeopleService.getPeople(schoolid);
            AnalysisService.getScrGraph(schoolid);
            $mdSidenav("school-sidenav").toggle();
        }

        function changeIndicator(index)
        {
            $log.log("Changing Indicator to", index);
            if (vm.index==index)
                return;
            vm.index = index;
            vm.indicator = $rootScope.indicators[vm.index]["dbKey"];
            $rootScope.activeIndicatorIndex = index;
            vm.filters = $rootScope.filterData[vm.index];
            vm.divisions = vm.mapDivs[vm.index]["values"];
            updateLegends();
            getReportingData();
        }

        function toggleStar(index){
            vm.insights[index].starred = !vm.insights[index].starred;
        }

        function getZoneDescription(feature) {
            var zoneDescription = "<b>Zone</b>: "+feature.properties.zoneid+"<br/><b>District</b>: "+feature.properties.district;
            return zoneDescription;
        }

        function highlightZone(event, feature) {

            var layer = event.target;
            layer.setStyle({
                weight: 3,
                color: 'yellow',
                dashArray: '',
                fillOpacity: 0.7
            });

            if (!L.Browser.ie && !L.Browser.opera) {
                layer.bringToFront();
            }

            var popup = $("<div></div>", {
                class: "zonePopup",
                css: {
                    position: "absolute",
                    top: "200px",
                    left: "20px",
                    zIndex: 1002,
                    backgroundColor: "white",
                    opacity: 0.7,
                    minWidth: "150px",
                    padding: "8px",
                    border: "1px solid #ccc"
                }
            });

            // Insert a headline into that popup
            var zoneString = "";
            var description = getZoneDescription(feature);
            var indicatorstring="<br/><b>"+vm.indicator+"</b>: ";
            var zoneValue = getZoneValue(feature.properties.zoneid);

            if (zoneValue != -1) {
                zoneString = indicatorstring+getZoneValue(feature.properties.zoneid);
            }

            var hed = $("<div>"+description+zoneString+"</div>", {
                css: {fontSize: "16px", marginBottom: "3px"}
            }).appendTo(popup);

            // Add the popup to the map
            popup.appendTo("#map");
        }

        function resetZone(event) {
             $(".zonePopup").remove();
            vm.geojson.resetStyle(event.target);
        }

        function resetLayers(fillColor) {
            leafletData.getMap().then(function(map){
                // vm.geomap = map;
                map.zoomControl.setPosition('bottomright');

                map.eachLayer(function (layer) {
                    map.removeLayer(layer);
                });

                vm.geojson = L.geoJson(vm.geodata, {
                    style: function (feature) {
                        return {
                            fillColor: fillColor(feature),
                            weight: 2,
                            opacity: 1,
                            color: 'white',
                            dashArray: '3',
                            fillOpacity: 0.7};
                    },
                    onEachFeature: function (feature, layer) {
                        layer.on({
                            mouseover: function (event) {highlightZone(event, feature)},
                            mouseout: resetZone,
                            click: function (event) {zoneClick(event, feature)}
                        });
                    }
                }).addTo(map);
            });
        }

        function getZoneValue(zoneid) {
            if(!vm.zoneData)
                return -1;

            var val = -1;
            if (zoneid==-1) {
                val = averageScore();
            }

            if (vm.zoneData[zoneid%100 - 1]) {
                val = Math.round(vm.zoneData[zoneid%100 - 1][vm.indicator] * 10) / 10;
            }

            return val;
        }

        function getNumSchoolsInZone(zoneid) {
            return getSchoolsForAZone(zoneid).length;
        }


        function getColor(feature) {
            var zoneid = feature.properties.zoneid;
            var array_id = zoneid%100 - 1;

            var col = '';
            if (array_id < vm.zoneData.length) {
                col = getShadeFromValue(vm.zoneData[array_id]);
            }

            return col=='shade1' ? '#bd0026' :  //670216
                   col=='shade2' ? '#be2c40' :  //6a1723
                   col=='shade3' ? '#fc4e2a' :  //a2280f
                   col=='shade4' ? '#d19662' :  //7e4a1d ..
                   col=='shade5' ? '#addd8e' :  //55a323
                   col=='shade6' ? '#31a354' :  //0d5624
                   col=='shade7' ? '#428b67' :  //1b5237
                                   '#0a0b0c' ;  //3c3c3c
        }

        function updateLegends() {
            var operator = vm.mapDivs[vm.index]["sort"];
            setSlider($rootScope.indicators[vm.index]["yearFrom"],$rootScope.indicators[vm.index]["yearTo"],$rootScope.indicators[vm.index]["yearTo"]);
            
            if (operator == "asc") {
                vm.firstLegend = ">";
                vm.lastLegend = "<";
            } else {
                vm.firstLegend = "<";
                vm.lastLegend = ">";
            }
        }

        function getMapDivs() {
            DashboardService.getMapDivs().then(function(response){
                vm.mapDivs = response.data;
                vm.divisions = vm.mapDivs[vm.index]["values"];
                updateLegends();
            });
        }

        function getReportingData() {
            $rootScope.loadingProgress = true;
            DashboardService.getReportingData(vm.index).then(function(response){
                $rootScope.loadingProgress = false;
                vm.reportingData = response.data;
                processIndicator();
            })
        }

        function getInsights(){
            DashboardService.getInsights().then(function(response){
                vm.insights = response.data;
            });
        }

        //To be called whenever any zone is clicked or indicator is changed or filters are changed
        // to be called from zoneClick or processIndicator

        function setZoneInformation(feature) {
            var zoneid=-1;

            if (feature) {
                zoneid = feature.properties.zoneid;
                vm.zoneDescription = getZoneDescription(feature)
            } else {
                vm.zoneDescription = "";
            }

            var zoneValue = getZoneValue(zoneid);

            if (zoneValue != -1)
                vm.averageScore = zoneValue;
            else
                $log.error("couldn't set average score", zoneValue, zoneid);

            if (vm.schoolData)
                vm.numSchools = vm.schoolData.length;
        }

        function removeAllMarkers(map){
            vm.markers.forEach(function(item,index){
                map.removeLayer(item);
            });
        }

        function zoneClick(event, feature) {
            leafletData.getMap().then(function(map) {

                //zoom to the zone
                map.fitBounds(event.target.getBounds());

                removeAllMarkers(map);
                vm.markers = [];

                if (!vm.zoneData)
                    return;

                //TODO CHECK SANCTITY OF FOLLOWING
                vm.schoolData = getSchoolsForAZone(feature.properties.zoneid);
                updateSchoolList(vm.schoolData);

                var oms = new OverlappingMarkerSpiderfier(map, {nearbyDistance:50, legWeight:2.5});

                vm.schoolData.forEach(function(item,index){

                    var markerIcon = L.AwesomeMarkers.icon({
                        markerColor: getShadeFromValue(item),
                        prefix: 'fa',
                        iconColor: 'white'
                    });

                    var indicator = vm.indicator;

                    if (item.latitude == null || item.longitude == null) {
                        // continue;
                        //$log.error("Latitude/longitude is null", item);
                    } else {
                        var marker = new L.marker([item.latitude,item.longitude], {icon: markerIcon}).bindPopup(indicator+": "+parseInt(item[indicator]));
                        marker.school = item.school;

                        map.addLayer(marker);
                        oms.addMarker(marker);

                        marker.on('mouseover', function (e) {
                            this.openPopup();
                        });
                        marker.on('mouseout', function (e) {
                            this.closePopup();
                        });

                        vm.markers.push(marker);
                    }
                });

                setZoneInformation(feature);

                oms.addListener('click', function(marker) {
                    // marker.bounce({duration: 1000, height: 50}, function() {});
                    vm.showSchool(marker.school)
                });
            });
        }
    }
})();