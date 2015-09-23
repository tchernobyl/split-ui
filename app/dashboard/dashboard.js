angular.module('dashboard', [])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('dashboard', {
            abstract: true,
            url: '/',
            templateUrl: 'templates/layouts/default.html'
        }).state('dashboard.index', {
                url: '',
                templateUrl: 'dashboard/dashboard.html',
                controller: 'DashboardController'
            });
    }]);