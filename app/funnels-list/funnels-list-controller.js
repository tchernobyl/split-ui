angular.module('funnels_list')
    .controller('FunnelsListController',
        ['$scope', '$rootScope', '$http', '_funnel', '_funnelPaths',
            function ($scope, $rootScope, $http, _funnel, _funnelPaths) {


                $scope.goalOptions = {
                    optionsSearch: ['successRate', 'totalPaidAmount'],
                    optionSelected: 'successRate'
                };
                $scope.listPaths = {
                    page: 1,
                    start: 0,
                    length: 5,
                    totalPage: 0
                };


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
                            text: 'BlitzBrands',
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
                $scope.highcharts2 = {
                    options: {
                        chart: {
                            type: 'bar'
                        },
                        title: {
                            text: 'Stacked bar chart'
                        },
                        plotOptions: {
                            series: {
                                stacking: 'normal'
                            }
                        }
                    },

                    xAxis: {
                        categories: ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Total fruit consumption'
                        }
                    },

                    legend: {
                        reversed: true
                    },
                    series: [
                        {
                            name: 'success',
                            data: []

                        },
                        {
                            name: 'failed',
                            data: []
                        }
                    ]
                };

                $scope.selectOptions = function () {

                    var arr = angular.copy($scope.allpaths)
                    $scope.allpaths = [];

                    reformatPathsBy($scope.goalOptions.optionSelected, arr)
                };
                $scope.funnel.pathNumber = 0;

                $scope.highcharts.xAxis.categories = [];
                $scope.getPathStatistics = function ($index) {
                    getPathStatistics($index)

                };
                $scope.getStatisticsStep = function ($index) {
                    $scope.stepSelected = $scope.PathSelected.funnel[$index]


                };
                $scope.getTotalPaidAmount = function (n, m, b) {

                    return Math.round(n * m) * b;
                };
                $scope.getTotalFunnelSuccessFailed = function (n, m) {

                    return Math.round(n * m);
                };

                $scope.changePage = function () {

                    $scope.listPaths.start = ($scope.listPaths.page - 1) * $scope.listPaths.length;
                    updatehighcharts();


                };
                $scope.getTotalPage = function () {
                    return $scope.listPaths.totalPage = Math.ceil($scope.allpaths.allPaths.length / $scope.listPaths.length);

                };
                init();

                function init() {
                    //browse steps
                    var arry = [];
                    for (var i = 0; i < $scope.funnel.steps.length; i++) {

                        arry[i] = 0;
                        $scope.highcharts.xAxis.categories.push($scope.funnel.steps[i].name);
                        if ($scope.funnel.pathNumber == 0) {
                            $scope.funnel.pathNumber = $scope.funnel.steps[i].experiences.length;
                        } else {
                            $scope.funnel.pathNumber = $scope.funnel.pathNumber * $scope.funnel.steps[i].experiences.length;
                        }

                    }
                    if (_funnelPaths) {
                        $scope.allpaths = _funnelPaths;

                    } else {
                        var ary = {
                            allPaths: []
                        };
                        ary = getObjectFromArray(arry, ary);


                        getPossiblePaths(arry, ary);
                    }


                }

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


                            reformatPathsBy($scope.goalOptions.optionSelected, result);
                            return;
                        }
                        result = getObjectFromArray(posArray, result);

                        getPossiblePaths(posArray, result)
                    }
                }

                function reformatPathsBy(field, ary) {


                    for (var i = 0; i < ary.allPaths.length; i++) {
                        for (var j = i + 1; j < ary.allPaths.length; j++) {

                            if (ary.allPaths[i][field] < ary.allPaths[j][field]) {
                                var per = ary.allPaths[i];
                                ary.allPaths[i] = ary.allPaths[j];
                                ary.allPaths[j] = per;
                            }

                        }
                    }
                    $scope.allpaths = ary;
                    console.log(JSON.stringify($scope.allpaths))


                }


                function calculateSeries(object) {
                    $scope.highcharts2.xAxis.categories = [];
                    $scope.highcharts2.series[0].data = [];
                    $scope.highcharts2.series[1].data = [];
                    for (var i = 0; i < object.funnel.length; i++) {
                        $scope.highcharts2.xAxis.categories.push(object.funnel[i].name);
                        $scope.highcharts2.series[0].data.push(object.funnel[i].success);
                        $scope.highcharts2.series[1].data.push(object.funnel[i].failer);
                    }


                }

                function getPathStatistics($index) {
                    $scope.PathSelected = $scope.allpaths.allPaths[$index];
                    $scope.PathSelected.rank = $index;
                    $scope.stepSelected = $scope.PathSelected.funnel[0];
                    calculateSeries($scope.PathSelected);
                }


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
                        path.failedRate = 1 - path.successRate;
                        path.totalPaidAmount = Math.round(path.successRate * path.total) * $scope.funnel.orderAmount;
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

                updatehighcharts();
                function updatehighcharts() {
                    $scope.highcharts.seriesS = [];
                    var start = (($scope.listPaths.page - 1) * $scope.listPaths.length);
                    var end = start + $scope.listPaths.length;
                    if (end > $scope.allpaths.allPaths.length) {
                        end = $scope.allpaths.allPaths.length;
                    }


                    for (var o = start; o < end; o++) {

                        var series_s = {
                            name: $scope.allpaths.allPaths[o].id,
                            data: []
                        };
                        var series_f = {
                            name: $scope.allpaths.allPaths[o].id,
                            data: []
                        };
                        console.log($scope.allpaths.allPaths[o])
                        for (var oo = 0; oo < $scope.allpaths.allPaths[o].funnel.length; oo++) {
                            series_s.data.push($scope.allpaths.allPaths[o].funnel[oo].successRate)
                            series_f.data.push($scope.allpaths.allPaths[o].funnel[oo].failerRate)
                        }
                        $scope.highcharts.seriesS.push(series_s);


                    }
                    $scope.highcharts.series = $scope.highcharts.seriesS;


                }

                function getRandomArbitrary(min, max) {

                    return Math.round(Math.random() * (max - min) + min);
                }


            }]);
