angular.module('funnels', [])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('funnels', {
                abstract: true,
                url: '/funnels',
                templateUrl: 'templates/layouts/default.html'
            })
            .state('funnels.index', {
                url: '',
                resolve: {
                    funnel: [
                        function () {
                            return funnels[0];
                        }]
                },
                templateUrl: 'funnels/funnels.html',
                controller: 'FunnelsController'
            });
    }]);