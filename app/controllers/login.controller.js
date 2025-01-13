app.controller("LoginController", function ($scope, $http) {
  $scope.credentials = {
    username: "",
    password: "",
  };

  $scope.login = function () {
    //check if the credentials are valid
    console.log($scope.credentials);
    
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
      },
      function errorCallback(error) {
        console.error("Login failed:", error.data);
      }
    );
  };
});
