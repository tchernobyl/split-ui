angular.module('dashboard')
    .controller('DashboardController',
        ['$scope', '$rootScope', '$http', 'highchartsNG',
            function ($scope, $rootScope, $http, highchartsNG) {
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
                        categories: ['Control', 'variantA', 'variantB', 'variantC']
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
                                [24.5, 30],
                                [22, 40],
                                [40, 54],
                                [40, 54]

                            ]
                        }
                    ]

                };

                $scope.dataCalculated = {};
                $scope.bestZ_score = null;

                var treatments = {
                    "treatment": [
                        "variantA",
                        "variantB",
                        "variantC",
                        "variantD"
                    ],
                    "visitors": [
                        "400",
                        "722",
                        "1033",
                        "140"
                    ],
                    "conversions": [
                        "150",
                        "280",
                        "390",
                        "35"
                    ],
                    "baseline": [
                        "1"
                    ]
                };
                $scope.bestOne = null;

                $rootScope.isLoading = true;

                $scope.start = function () {

                    getData();
                };
                $scope.updateCalculatedData = function ($index) {
                    treatments.baseline = [$index];
                    req.data = getAsUriParameters(treatments);
                    getData();
                };


                var req = {
                    method: 'POST',
                    url: '../php-files/process.php',
                    headers: {

                        'Content-Type': 'application/x-www-form-urlencoded'

                    },
                    data: getAsUriParameters(treatments)
                };

                function getAsUriParameters(data) {
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
                    $scope.bestZ_score = null;
                    $scope.bestOne = {};
                    $http(req).then(function (res) {
                        $scope.dataCalculated = res.data;
                        $scope.hig2hcharts.xAxis.categories = [];
                        $scope.hig2hcharts.series[0].data = [];
                        for (var j = 0; j < $scope.dataCalculated.experiments.length; j++) {
                            var xp = $scope.dataCalculated.experiments[j];
                            var experiment = new Abba.Experiment(3, 40, 150, 0.05);
                            var results = experiment.getResults(parseInt(xp.Conversions), parseInt(xp.Visitors));

                            $scope.hig2hcharts.xAxis.categories.push(xp.Treatment);
                            $scope.hig2hcharts.series[0].data.push([Math.round(results.proportion.lowerBound * 100000) / 1000, Math.round(results.proportion.upperBound * 100000) / 1000]);


                        }


                        calculateTehBestOne($scope.dataCalculated.experiments);

                    }, function (res) {

                    });

                }

                function calculateTehBestOne(experiments) {

                    for (var $i = 0; $i < experiments.length; $i++) {
                        if (experiments[$i].Zscore > 0) {
                            if ($scope.bestZ_score == null) {
                                $scope.bestZ_score = experiments[$i].Zscore;
                                $scope.bestOne = experiments[$i];
                            } else {
                                if (experiments[$i].Zscore > $scope.bestZ_score) {
                                    $scope.bestZ_score = experiments[$i].Zscore;
                                    $scope.bestOne = experiments[$i];
                                }
                            }

                        }

                    }
                }


            }]);
