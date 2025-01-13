app.controller("LoginController", function ($scope, $http, $location) {
  $scope.credentials = {
    username: "",
    password: "",
  };

  $scope.validateAndLogin = function () {
    if (!/^\d{11}$/.test($scope.credentials.username)) {
      alert("شماره تلفن باید ۱۰ رقم باشد");
      return;
    }
    if ($scope.credentials.password.length <= 3) {
      alert("رمز عبور باید بیشتر از ۳ کاراکتر باشد");
      return;
    }
    // If validations pass, proceed with login
    $scope.login();
  };

  $scope.login = function () {
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
    }).then(
      function successCallback(response) {
        console.log("Login successful:", response.data);
        $location.path("/");
      },
      function errorCallback(error) {
        console.error("Login failed:", error.data);
      }
    );
  };
});
