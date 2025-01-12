var app = angular.module("app", ["ngRoute"]).config([
  "$routeProvider",
  "$locationProvider",
  function ($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
      .when("/", {
        templateUrl: "app/views/dashboard.html",
        controller: "DashboardController",
      })
      .when("/login", {
        templateUrl: "app/views/login.html",
        controller: "LoginController",
      })
      .otherwise({
        redirectTo: "/",
      });
  },
]);
