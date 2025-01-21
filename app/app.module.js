var app = angular
  .module("app", ["ngRoute", "ngCookies"])
  .config([
    "$routeProvider",
    "$locationProvider",
    "$httpProvider",
    function ($routeProvider, $locationProvider, $httpProvider) {
      $locationProvider.html5Mode(true);
      // Configure routes
      $routeProvider
        .when("/", {
          templateUrl: "app/views/dashboard.html",
          controller: "DashboardController",
          resolve: {
            auth: [
              "AuthService",
              "$location",
              function (AuthService, $location) {
                if (!AuthService.isAuthenticated()) {
                  $location.path("/login");
                }
                return true;
              },
            ],
          },
        })
        .when("/login", {
          templateUrl: "app/views/login.html",
          controller: "LoginController",
          resolve: {
            auth: [
              "AuthService",
              "$location",
              function (AuthService, $location) {
                if (AuthService.isAuthenticated()) {
                  $location.path("/dashboard");
                }
                return true;
              },
            ],
          },
        })
        .when("/dashboard", {
          templateUrl: "app/views/dashboard.html",
          controller: "DashboardController",
          resolve: {
            auth: [
              "AuthService",
              "$location",
              function (AuthService, $location) {
                if (!AuthService.isAuthenticated()) {
                  $location.path("/login");
                }
                return true;
              },
            ],
          },
        })
        .when("/createuser", {
          templateUrl: "app/views/createuser.html",
          controller: "CreateUser",
          resolve: {
            auth: [
              "AuthService",
              "$location",
              function (AuthService, $location) {
                if (!AuthService.isAuthenticated()) {
                  $location.path("/login");
                }
                return true;
              },
            ],
          },
        })
        .when("/edituser/:id", {
          templateUrl: "app/views/editUser.html",
          controller: "EditUserController",
          resolve: {
            auth: [
              "AuthService",
              "$location",
              function (AuthService, $location) {
                if (!AuthService.isAuthenticated()) {
                  $location.path("/login");
                }
                return true;
              },
            ],
          },
        })
        .otherwise({
          redirectTo: function () {
            return "/login";
          },
        });

      // Add the interceptor
      $httpProvider.interceptors.push("AuthInterceptor");
    },
  ])
  .run([
    "$rootScope",
    "AuthService",
    "$location",
    function ($rootScope, AuthService, $location) {
      $rootScope.$on("$routeChangeStart", function (event, next, current) {
        if (
          !AuthService.isAuthenticated() &&
          next.templateUrl !== "app/views/login.html"
        ) {
          $location.path("/login");
        }
      });
    },
  ]);
