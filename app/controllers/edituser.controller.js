app.controller(
  "EditUserController",
  function ($scope, $routeParams, UserService, $location, $http, $cookies) {
    $scope.breadcrumbs = [
      { label: "مدیریت", url: "/dashboard" },
      { label: "کاربران", url: "/users" },
    ];

    $scope.$on("$routeChangeSuccess", function (event, currentRoute) {
      const path = currentRoute.originalPath;
      if (path === "/edituser/:id") {
        $scope.breadcrumbs = [
          { label: "مدیریت", url: "/dashboard" },
          { label: "کاربران", url: "/dashboard" },
          { label: "ویرایش کاربر", url: "/edituser" },
        ];
      }
    });

    $scope.welcomeMessage = "ویرایش کاربر";
    $scope.isLoading = true;

    // بررسی وجود داده در UserService در صورت نبود از api
    const selectedUser = UserService.getSelectedUser();
    if (selectedUser && selectedUser.id === $routeParams.id) {
      $scope.user = selectedUser;
      $scope.isLoading = false;
    } else if ($routeParams.id) {
      $http({
        method: "GET",
        url: "/api/manage/users/" + $routeParams.id,
        headers: {
          Authorization: "Bearer " + $cookies.get("token"),
        },
      })
        .then(function (response) {
          $scope.user = response.data.user;
          UserService.setSelectedUser($scope.user);
        })
        .catch(function (error) {
          console.error("Error loading user from API:", error);
          if (error.status === 401) {
            $cookies.remove("token");
            $location.path("/login");
          }
        })
        .finally(function () {
          $scope.isLoading = false;
        });
    } else {
      console.error("No user ID provided in route parameters!");
      $scope.isLoading = false;
    }

    $scope.updateUser = function () {
      $scope.isLoading = true;
      if (!$scope.user || !$scope.user.id) {
        console.error("User or user ID is not defined.");
        return;
      }

      $http({
        method: "PUT",
        url: "/api/manage/users/" + $scope.user.id,
        headers: {
          Authorization: "Bearer " + $cookies.get("token"),
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        data: $scope.user,
      })
        .then(function (response) {
          if (response.data.success) {
            $location.path("/dashboard");
          }
        })
        .catch(function (error) {
          console.error("Error creating user:", error);
          // بررسی وجود خطاها در context
          if (error.data && error.data.context) {
            const contextErrors = error.data.context;
            for (const field in contextErrors) {
              if (contextErrors[field]) {
                showToast(contextErrors[field]);
                return;
              }
            }
          }
        })

        .finally(function () {
          $scope.isLoading = false; // پایان لودینگ
        });
    };

    $scope.goBack = function () {
      $location.path("/dashboard");
    };

    function showToast(message) {
      var toastElement = document.getElementById("errorToast");
      document.getElementById("toastMessage").innerText = message;
      var toast = new bootstrap.Toast(toastElement, {
        animation: true,
        autohide: true,
        delay: 3000,
      });
      toast.show();
    }
  },
);
