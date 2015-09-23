angular.module('experiments', [])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('experiments', {
            abstract: true,
            url: '/',
            templateUrl: 'templates/layouts/default.html'
        }).state('experiments.index', {
                url: '',
                templateUrl: 'experiments/experiments.html',
                controller: 'ExperimentsController'
            });
    }]);