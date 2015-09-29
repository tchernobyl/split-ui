angular.module('funnels')
    .factory('FunnelsStatistics',
        [  '$http',
            function ($http) {


                var funnel = funnels[0];
                var funnelsStatistics = {};

                funnelsStatistics.getFunnel = getRe(function () {
                    console.log(2);
                });

                function getRe(f) {

                    for (var i = 0; i < funnel.experiments.length; i++) {
                        console.log(1);
                        var j = angular.copy(i);
                        var end = j + 1 == funnel.experiments.length;
                        var experiment = funnel.experiments[i];
                        getData(experiment, end);

                    }

                    f();

                }


                function getData(treatment, end) {


                    treatment.bestZ_score = null;
                    treatment.bestOne = {};
                    $http(getRequest(treatment)).then(function (res) {
                        treatment.dataCalculated = res.data;
                        calculateTehBestOne(treatment);
                        if (end) {


                            return funnel;
                        } else {
                            console.log(5);
                        }
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
                        url: '../php-files/process.php',
                        headers: {

                            'Content-Type': 'application/x-www-form-urlencoded'

                        },
                        data: getAsUriParameters(treatment)
                    };
                }

                return funnelsStatistics;

            }]);