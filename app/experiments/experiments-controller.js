angular.module('experiments')
    .controller('ExperimentsController',
        ['$scope', '$rootScope', '$http', '_treatment', '_funnel', 'ServerStat',
            function ($scope, $rootScope, $http, _treatment, _funnel, ServerStat) {


                $scope.hig2hcharts = {
                    options: {
                        chart: {
                            type: 'columnrange',
                            inverted: true
                        },
                        tooltip: {
                            valueSuffix: '%'
                        },

                        legend: {
                            enabled: false
                        },

                        plotOptions: {
                            columnrange: {
                                dataLabels: {
                                    enabled: true,
                                    formatter: function () {
                                        return this.y + '%';
                                    }
                                }
                            }
                        }
                    },


                    title: {
                        text: 'Success Rate'
                    },

                    subtitle: {
                        text: ''
                    },

                    xAxis: {
                        categories: []
                    },

                    yAxis: {
                        title: {
                            text: ''
                        }
                    },

                    series: [
                        {
                            name: '',
                            data: [


                            ]
                        }
                    ]

                };


                $scope.treatments = _treatment;
                $scope.funnel = _funnel;
                $scope.treatments.dataCalculated = {};
                $scope.treatments.bestZ_score = null;
                $scope.treatments.bestOne = null;


                $scope.start = function () {

                    getData();
                };
                $scope.updateCalculatedData = function ($index) {
                    $scope.treatments.baseline = [$index];
                    req.data = getAsUriParameters($scope.treatments);
                    getData();
                };


                var req = {
                    method: 'POST',
                    url: ServerStat.url,
                    headers: {

                        'Content-Type': 'application/x-www-form-urlencoded'

                    },
                    data: getAsUriParameters($scope.treatments)
                };

                function getAsUriParameters(data) {
                    console.log(data);
                    return Object.keys(data).map(function (k) {
                        if (_.isArray(data[k])) {
                            var keyE = encodeURIComponent(k + '[]');
                            return data[k].map(function (subData) {
                                return keyE + '=' + encodeURIComponent(subData);
                            }).join('&');
                        } else {
                            return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]);
                        }
                    }).join('&');
                }

                getData();
                function getData() {
                    $scope.treatments.bestZ_score = null;
                    $scope.treatments.bestOne = {};
                    $http(req).then(function (res) {
                        $scope.treatments.dataCalculated = res.data;
                        $scope.hig2hcharts.xAxis.categories = [];
                        $scope.hig2hcharts.series[0].data = [];
                        for (var j = 0; j < $scope.treatments.dataCalculated.experiments.length; j++) {
                            var xp = $scope.treatments.dataCalculated.experiments[j];
                            var experiment = new Abba.Experiment(3, 40, 150, 0.05);
                            var results = experiment.getResults(parseInt(xp.Conversions), parseInt(xp.Visitors));

                            $scope.hig2hcharts.xAxis.categories.push(xp.Treatment);
                            $scope.hig2hcharts.series[0].data.push(
                                [
                                    Math.round(results.proportion.lowerBound * 100000) / 1000,
                                    Math.round(results.proportion.upperBound * 100000) / 1000
                                ]
                            );


                        }


                        calculateTehBestOne($scope.treatments.dataCalculated.experiments);

                    }, function (res) {

                    });

                }

                function getPoint(num_trial, num_success, num_success2) {
                    var p = num_success / num_trial;
                    var p2 = num_success2 / num_trial;

                    return [p2, cardinal(num_trial, num_success) * Math.pow(p, num_success2) * Math.pow((1 - p), (num_trial - num_success2))];


                }

                function cardinal(num_trial, num_success) {
                    return factorial(num_trial) / (factorial(num_trial - num_success) * factorial(num_success));


                }

                function factorial(num) {
                    // If the number is less than 0, reject it.
                    if (num < 0) {
                        return -1;
                    }
                    // If the number is 0, its factorial is 1.
                    else if (num == 0) {
                        return 1;
                    }
                    // Otherwise, call this recursive procedure again.
                    else {

                        return (num * factorial(num - 1));
                    }
                }

                function calculateTehBestOne(experiments) {

                    for (var $i = 0; $i < experiments.length; $i++) {
                        if (experiments[$i].Zscore > 0) {
                            if ($scope.treatments.bestZ_score == null) {
                                $scope.treatments.bestZ_score = experiments[$i].Zscore;
                                $scope.treatments.bestOne = experiments[$i];
                            } else {
                                if (experiments[$i].Zscore > $scope.treatments.bestZ_score) {
                                    $scope.treatments.bestZ_score = experiments[$i].Zscore;
                                    $scope.treatments.bestOne = experiments[$i];
                                }
                            }

                        }

                    }
                }


            }]);
