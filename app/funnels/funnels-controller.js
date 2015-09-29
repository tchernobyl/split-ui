angular.module('funnels')
    .controller('FunnelsController',
        ['$scope', '$rootScope', '$http', 'highchartsNG', '_funnel', 'ServerStat',
            function ($scope, $rootScope, $http, highchartsNG, _funnel, ServerStat) {


                var funnel = _funnel;
                console.log(_funnel)
                var funnelsStatistics = {};
                $scope.end = false;
                funnelsStatistics.getFunnel = getRe();

                function getRe() {
                    for (var i = 0; i < funnel.experiments.length; i++) {
                        var j = angular.copy(i);
                        $scope.end = (j + 1 == funnel.experiments.length);
                        var experiment = funnel.experiments[i];
                        getData(experiment);
                    }
                }

                $scope.updateCalculatedData = function ($index, treatment) {

                    treatment.baseline = [$index];
                    getData(treatment);
                };

                function getData(treatment) {

                    treatment.bestZ_score = null;
                    treatment.bestOne = {};
                    $http(getRequest(treatment)).then(function (res) {
                        treatment.dataCalculated = res.data;

                        calculateTehBestOne(treatment);
                        $scope.funnel = funnel;
                    }, function (res) {

                    });
                }

                function calculateTehBestOne(treatment) {

                    for (var $i = 0; $i < treatment.dataCalculated.experiments.length; $i++) {
                        if (treatment.dataCalculated.experiments[$i].Zscore > 0) {
                            if (treatment.bestZ_score == null) {
                                treatment.bestZ_score = treatment.dataCalculated.experiments[$i].Zscore;
                                treatment.bestOne = treatment.dataCalculated.experiments[$i];
                            } else {
                                if (treatment.dataCalculated.experiments[$i].Zscore > treatment.bestZ_score) {

                                    treatment.bestZ_score = treatment.dataCalculated.experiments[$i].Zscore;
                                    treatment.bestOne = treatment.dataCalculated.experiments[$i];
                                }
                            }

                        }

                    }
                }

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

                function getRequest(treatment) {
                    return {
                        method: 'POST',
                        url: ServerStat.url,
                        headers: {

                            'Content-Type': 'application/x-www-form-urlencoded'

                        },
                        data: getAsUriParameters(treatment)
                    };
                }


            }]);
