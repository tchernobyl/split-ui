angular.module('funnels_list', [])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('funnels_list', {
                abstract: true,
                url: '/funnels_list',
                templateUrl: 'templates/layouts/default.html'
            })
            .state('funnels_list.index', {
                url: '/{id:[0-9]*}',
                resolve: {
                    _funnel: ['$stateParams',
                        function ($stateParams) {
                            if ($stateParams.id) {
                                return funnels_list[$stateParams.id];
                            } else {
                                return funnels_list[0];
                            }

                        }



                    ]
                },
                templateUrl: 'funnels-list/funnels_list.html',
                controller: 'FunnelsListController'
            });
    }]);