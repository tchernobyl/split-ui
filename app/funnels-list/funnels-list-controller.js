angular.module('funnels_list')
    .controller('FunnelsListController',
        ['$scope', '$rootScope', '$http', '_funnel',
            function ($scope, $rootScope, $http, _funnel) {


                $scope.funnel = _funnel;
                $scope.diagramConfig = {
                    maxFunnels: 10,
                    startFunnel: 0,
                    successDiagram: true,
                    successTitle: "Failure",
                    failureTitle: 'Success',
                    title: 'Success'
                };
                $scope.highcharts = {
                    options: {
                        title: {
                            text: $scope.diagramConfig.title + ' percentage of each step in ' + _funnel.name + '.',
                            x: -20 //center
                        },
                        subtitle: {
                            text: 'Source: WorldClimate.com',
                            x: -20
                        }
                    },

                    xAxis: {
                        categories: []
                    },
                    yAxis: {
                        title: {
                            text: 'Percentage (%)'
                        },
                        plotLines: [
                            {
                                value: 0,
                                width: 2,
                                color: 'red'
                            }
                        ]
                    },
                    tooltip: {
                        valueSuffix: '°C'
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'middle',
                        borderWidth: 0
                    },
                    series: [],
                    seriesS: [],
                    seriesF: []
                };
                $scope.funnel.pathNumber = 0;

                $scope.highcharts.xAxis.categories = [];
                //browse steps
                for (var i = 0; i < $scope.funnel.steps.length; i++) {

                    $scope.highcharts.xAxis.categories.push($scope.funnel.steps[i].name);
                    if ($scope.funnel.pathNumber == 0) {
                        $scope.funnel.pathNumber = $scope.funnel.steps[i].experiences.length;
                    } else {
                        $scope.funnel.pathNumber = $scope.funnel.pathNumber * $scope.funnel.steps[i].experiences.length;
                    }

                }


                var arry = [];
                for (var yy = 0; yy < $scope.funnel.steps.length; yy++) {
                    arry[yy] = 0;
                }


                var ary = {
                    allPaths: []
                };


                ary = getObjectFromArray(arry, ary);


                getPossiblePaths(arry, ary);


                function getPossiblePaths(posArray, result) {
                    var stepsLength = $scope.funnel.steps.length - 1;
                    if (posArray[stepsLength] < $scope.funnel.steps[stepsLength].experiences.length) {
                        posArray[stepsLength]++;
                        if (posArray[stepsLength] < $scope.funnel.steps[stepsLength].experiences.length) {
                            result = getObjectFromArray(posArray, result);
                        }
                        getPossiblePaths(posArray, result)
                    } else {
                        posArray[stepsLength] = 0;
                        posArray[stepsLength - 1]++;
                        for (var t = stepsLength - 1; t > 0; t--) {
                            if (posArray[t] < $scope.funnel.steps[t].experiences.length) {

                            } else {
                                posArray[t] = 0;
                                posArray[t - 1]++;
                            }
                        }
                        if (posArray[0] < $scope.funnel.steps[0].experiences.length) {
                        } else {

//                            reformatPathsBy("successRate",ary);
                            reformatPathsBy("failedRate", ary);
                            return;
                        }
                        result = getObjectFromArray(posArray, result);
                        getPossiblePaths(posArray, result)
                    }
                }

                function reformatPathsBy(field, ary) {

                    for (var i = 0; i < ary.allPaths.length; i++) {
                        for (var j = i + 1; j < ary.allPaths.length; j++) {
                            if (ary.allPaths[i][field] > ary.allPaths[j][field]) {
                                var per = ary.allPaths[i];
                                ary.allPaths[i] = ary.allPaths[j];
                                ary.allPaths[j] = per;
                            }

                        }
                    }
                    $scope.allpaths = ary;

//                    ary.allPaths.sort(function(a, b){
//                        var keyA = a[field],
//                            keyB = b[field];
//                        console.log(666)
//
//
//                        if(keyA < keyB) return -1;
//                        if(keyA > keyB) return 1;
//
//                        return 0;
//
//                    });
//

                }


                $scope.getPathStatistics = function ($index) {
                    $scope.PathSelected = $scope.allpaths.allPaths[$index];
                    $scope.stepSelected = $scope.PathSelected.funnel[0];


                };
                $scope.getStatisticsStep = function ($index) {
                    $scope.stepSelected = $scope.PathSelected.funnel[$index]
                    console.log($scope.stepSelected)
                };
                $scope.getTotalPaidAmount = function (n, m, b) {

                    return Math.round(n * m) * b;
                };
                function getObjectFromArray(array, object) {


                    var path = {
                        id: null,
                        funnel: [],
                        failedRate: null,
                        successRate: null,
                        failedRateProduct: null
                    };
                    path.id = object.allPaths.length + 1;
                    var series_s = {
                        name: path.id,
                        data: []
                    };
                    var series_f = {
                        name: path.id,
                        data: []
                    };
                    var maxTotal = getRandomArbitrary(50, 7000);
                    path.total = maxTotal;


                    for (var t = 0; t < array.length; t++) {


                        var step = angular.copy($scope.funnel.steps[t].experiences[array[t]]);
                        path.funnel.push(step);


                        var total = maxTotal;

                        if (t > 0) {
                            total = path.funnel[t - 1].success;

                        }
                        var success = getRandomArbitrary(50, total);
                        var failed = total - success;


                        path.funnel[t].success = success;
                        path.funnel[t].failer = failed;
                        path.funnel[t].total = total;
                        path.funnel[t].successRate = success / total;
                        path.funnel[t].failerRate = failed / total;
                        path.failedRate = 1 - path.successRate;
                        if (path.failedRateProduct === null) {
                            path.failedRateProduct = path.funnel[t].failerRate;
                        } else {
                            path.failedRateProduct = path.failedRateProduct * path.funnel[t].failerRate;
                        }
                        if (path.successRate === null) {
                            path.successRate = path.funnel[t].successRate;
                        } else {
                            path.successRate = path.successRate * path.funnel[t].successRate;
                        }

                        series_s.data.push(path.funnel[t].successRate);
                        series_f.data.push(path.funnel[t].failerRate);


                    }

                    $scope.highcharts.seriesS.push(series_s);
                    $scope.highcharts.seriesF.push(series_f);


                    if ($scope.diagramConfig.successDiagram) {

                        $scope.highcharts.series = $scope.highcharts.seriesS;

                    } else {
                        $scope.highcharts.series = $scope.highcharts.seriesF;
                    }
                    object.allPaths.push(path);
                    return object;

                }

                function getRandomArbitrary(min, max) {
                    var value = Math.round(Math.random() * (max - min) + min)

                    return value;
                }


            }]);
