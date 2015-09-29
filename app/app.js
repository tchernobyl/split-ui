angular.module('app',
        [
            'restangular',
            'ui.router',
            'ui.utils',
            'ui.bootstrap',
            'angular-growl',
            'ngRoute',
            'ngCookies',
            'highcharts-ng',


            'dashboard',
            'experiments',
            'funnels'

        ])


    .constant('LAYOUTS', {
        default: 'components/templates/layouts/default.html'
    })
    .constant('ServerStat', {
        url: '../php-files/process.php'
    })


    .config([
        '$urlRouterProvider',
        function ($urlRouterProvider) {
            $urlRouterProvider.otherwise('/');
        }])


    .run(['$rootScope', '$state', 'Restangular', 'growl', '$location', '$cookieStore', '$window',
        function ($rootScope, $state, Restangular, growl, $location, $cookieStore, $window) {


            $rootScope.$on("$stateChangeStart", function (event, to) {


            });
            $rootScope.$on('$stateChangeSuccess', function () {


            });

            $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {


            });

        }]);