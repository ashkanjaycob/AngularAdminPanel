var app = angular
  .module("app", ["ngRoute", "ngCookies"])
  .config([
    "$routeProvider",
    "$locationProvider",
    "$httpProvider",
    function ($routeProvider, $locationProvider, $httpProvider) {
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
        .when("/dashboard", {
          templateUrl: "app/views/dashboard.html",
          controller: "DashboardController",
        })
        .when("/createuser", {
          templateUrl: "app/views/createuser.html",
          controller: "CreateUser",
        })
        .when("/edituser/:id", {
          templateUrl: "app/views/editUser.html",
          controller: "EditUserController",
        })
        .otherwise({
          redirectTo: "/login",
        });

      $httpProvider.interceptors.push("AuthInterceptor");
    },
  ])
  .run([
    "$rootScope",
    "$location",
    "AuthService",
    function ($rootScope, $location, AuthService) {
      $rootScope.$on("$routeChangeStart", function (event, next) {
        const isLoginPage = next.templateUrl === "app/views/login.html";
        if (!AuthService.isAuthenticated() && !isLoginPage) {
          $location.path("/login");
        }
      });
    },
  ]);
