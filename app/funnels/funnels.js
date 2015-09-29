angular.module('funnels', [])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('funnels', {
                abstract: true,
                url: '/funnels',
                templateUrl: 'templates/layouts/default.html'
            })
            .state('funnels.index', {
                url: '/{id:[0-9]*}',
                resolve: {
                    _funnel: ['$stateParams',
                        function ($stateParams) {
                            if ($stateParams.id) {
                                return funnels[$stateParams.id];
                            } else {
                                return funnels[0];
                            }

                        }



                    ]
                },
                templateUrl: 'funnels/funnels.html',
                controller: 'FunnelsController'
            });
    }]);