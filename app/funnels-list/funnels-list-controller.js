angular.module('funnels_list')
    .controller('FunnelsListController',
        ['$scope', '$rootScope', '$http', '_funnel',
            function ($scope, $rootScope, $http, _funnel) {


                $scope.funnel = _funnel;

                $scope.funnel.pathNumber = 0;


                //browse steps
                for (var i = 0; i < $scope.funnel.steps.length; i++) {
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
                $scope.allpaths = ary;

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
                            console.log(result);
                            $scope.allpaths = ary;
                            return;

                        }
                        result = getObjectFromArray(posArray, result);

//                            result.push(posArray);


                        getPossiblePaths(posArray, result)

                    }

                }


                function getObjectFromArray(array, object) {

                    var path = {
                        funnel: []
                    };
                    for (var t = 0; t < array.length; t++) {


                        path.funnel.push($scope.funnel.steps[t].experiences[array[t]]);
                    }
                    object.allPaths.push(path)
                    return object;

                }


                console.log($scope.funnel.pathNumber);

            }]);
