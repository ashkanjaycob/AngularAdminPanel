var app = angular.module('app', ['ngRoute'])
    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'app/views/dashboard.html',
                controller: 'DashboardController'
            })
            .when('/login', {
                templateUrl: 'app/views/login.html',
                controller: 'LoginController'
            })
            .otherwise({
                redirectTo: '/'
            });
    });