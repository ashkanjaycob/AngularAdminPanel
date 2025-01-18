app.controller("EditUserController", function ($scope, $routeParams , UserService, $location, $http, $cookies) {
  
  $scope.welcomeMessage = "ویرایش کاربر";

  $scope.user = UserService.getSelectedUser();
  console.log($scope.user);
  
    if (!$scope.user) {
    console.error("No user selected!");
    return;
  }

  console.log("Editing user:", $scope.user);

  $scope.updateUser = function () {
    if (!$scope.user || !$scope.user.id) {
      console.error("User or user ID is not defined.");
      return;
    }

    console.log("Updated user:", $scope.user);

    $http({
      method: "PUT",
      url: "/api/user/contacts/" + $scope.user.id,
      headers: {
        Authorization: "Bearer " + $cookies.get("token"),
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: $scope.user,
    })
      .then(function (response) {
        console.log("API response:", response);
        if (response.data.success) {
          $location.path("/dashboard");
        }
      })
      .catch(function (error) {
        console.error("Error updating user:", error);
        if (error.status === 401) {
          $cookies.remove("token");
          $location.path("/login");
        }
      });
  };

  $scope.goBack = function () {
    console.log("Navigating back to dashboard.");
    $location.path("/dashboard");
  };

});
