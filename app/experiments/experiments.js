angular.module('experiments', [])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('experiments', {
            abstract: true,
            url: '/experiments',
            templateUrl: 'templates/layouts/default.html'
        }).state('experiments.index', {
                url: '/{idFunnel:[0-9]*}/{idExperiment:[0-9]*}',
                templateUrl: 'experiments/experiments.html',
                controller: 'ExperimentsController',
                resolve: {
                    _treatment: ['$stateParams',
                        function ($stateParams) {
                            if ($stateParams.idFunnel && $stateParams.idExperiment) {

                                return funnels[$stateParams.idFunnel].experiments[$stateParams.idExperiment];
                            } else {
                                return funnels[0].experiments[0];
                            }

                        }
                    ],
                    _funnel: ['$stateParams',
                        function ($stateParams) {
                            if ($stateParams.idFunnel) {

                                return funnels[$stateParams.idFunnel];
                            } else {
                                return funnels[0];
                            }

                        }
                    ]
                }
            });
    }]);