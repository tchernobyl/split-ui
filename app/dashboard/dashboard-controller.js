angular.module('dashboard')
    .controller('DashboardController',
        ['$scope', '$rootScope', '_funnels',
            function ($scope, $rootScope, _funnels) {

                $scope.funnels = _funnels;


            }]);
