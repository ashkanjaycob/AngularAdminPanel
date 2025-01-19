app.controller(
  "LoginController",
  function ($scope, $http, $location, $cookies) {
    $scope.credentials = {
      username: "",
      password: "",
    };
    $scope.showPassword = false;

    $scope.togglePassword = function () {
      $scope.showPassword = !$scope.showPassword;
    };
    $scope.errorMessage = "";

    $scope.validateAndLogin = function () {
      if (!/^\d{11}$/.test($scope.credentials.username)) {
        $scope.errorMessage = "شماره تلفن باید ۱۱ رقم باشد";
        var toastElement = document.getElementById("errorToast");
        var toast = new bootstrap.Toast(toastElement, {
          animation: true,
          autohide: true,
          delay: 3000,
        });
        toast.show();
        return;
      }
      if ($scope.credentials.password.length <= 3) {
        $scope.errorMessage = "رمز عبور باید بیشتر از ۳ کاراکتر باشد";
        var toastElement = document.getElementById("errorToast");
        var toast = new bootstrap.Toast(toastElement, {
          animation: true,
          autohide: true,
          delay: 3000,
        });
        toast.show();
        return;
      }
      $scope.login();
    };

    $scope.login = function () {
      $scope.isLoading = true;
      $http({
        method: "POST",
        url: "/api/user/create-session",
        data: {
          username: $scope.credentials.username,
          password: $scope.credentials.password,
        },
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(
          function successCallback(response) {
            $cookies.put("token", response.data.token);
            $location.path("/dashboard");
          },
          function errorCallback(error) {
            $scope.errorMessage = error.data.description;
            // Initialize and show the toast
            var toastElement = document.getElementById("errorToast");
            var toast = new bootstrap.Toast(toastElement, {
              animation: true,
              autohide: true,
              delay: 2000,
            });
            toast.show();
            console.error("Login failed:", error.data);
          },
        )
        .finally(function () {
          $scope.isLoading = false;
        });
    };
  },
);
