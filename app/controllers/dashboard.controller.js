app.controller(
  "DashboardController",
  function ($scope, $http, $location, $cookies, UserService) {
    var logoutModal;

    // Fetch user data
    function fetchUserData() {
      $scope.isLoading = true;
      $http({
        method: "GET",
        url: "/api/user",
        headers: {
          Authorization: "Bearer " + $cookies.get("token"),
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then(function (response) {
          $scope.isLoading = true;
          if (response.data.success) {
            $scope.userData = response.data.user;
            response.data.user.avatar =
              "https://www.shopgram123.ir" + response.data.user.avatar;
            $scope.userData = response.data.user;
          }
        })
        .catch(function (error) {
          console.error("Error fetching user data:", error);
          if (error.status === 401) {
            $cookies.remove("token");
            $location.path("/login");
          }
        })
        .finally(function () {
          $scope.isLoading = false; // پایان لودینگ
        });
    }

    $scope.showUsers = false;
    $scope.users = [];

    function loadUsers() {
      $http({
        method: "GET",
        url: "/api/manage/users",
        headers: {
          Authorization: "Bearer " + $cookies.get("token"),
        },
      })
        .then(function (response) {
          if (response.data.success) {
            $scope.users = response.data.users;
            $scope.showUsers = true;
          }
        })
        .catch(function (error) {
          if (error.status === 401) {
            $cookies.remove("token");
            $location.path("/login");
          }
        })
        .finally(function () {
          $scope.isLoading = false;
        });
    }

    $scope.deleteUserWithConfirmation = function (user) {
      if (!user || !user.id) {
        return;
      }

      $scope.userToDelete = user; // ذخیره کاربر برای تأیید حذف
      const deleteModal = new bootstrap.Modal(
        document.getElementById("deleteUserModal"),
      );
      deleteModal.show();
    };

    $scope.confirmDeleteUser = function () {
      if (!$scope.userToDelete || !$scope.userToDelete.id) {
        console.error("No user selected for deletion.");
        return;
      }

      $http({
        method: "DELETE",
        url: "/api/manage/users?identities=" + $scope.userToDelete.id,
        headers: {
          Authorization: "Bearer " + $cookies.get("token"),
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then(function (response) {
          if (response.data.success) {
            $scope.users = $scope.users.filter(
              (user) => user.id !== $scope.userToDelete.id,
            );
            $scope.userToDelete = null; // پاک‌سازی داده کاربر
          }
        })
        .catch(function (error) {
          console.error("Error deleting user:", error);
        });
    };

    $scope.goToEditUser = function (user) {
      if (user) {
        UserService.setSelectedUser(user);
        $location.path("/edituser/" + user.id);
      } else {
        console.error("No user selected!");
      }
    };

    // Initialize Bootstrap components
    angular.element(document).ready(function () {
      // Call fetchUserData when dashboard loads
      fetchUserData();
      loadUsers();
      // Initialize the logout modal
      logoutModal = new bootstrap.Modal(document.getElementById("logoutModal"));

      // Handle sidebar close on mobile
      var sidebarEl = document.getElementById("sidebar");
      var sidebar = bootstrap.Offcanvas.getOrCreateInstance(sidebarEl);

      if (window.innerWidth < 992) {
        var links = sidebarEl.querySelectorAll(".nav-link:not([ng-click])");
        links.forEach(function (link) {
          link.addEventListener("click", function () {
            sidebar.hide();
          });
        });
      }
    });

    // Logout functions
    $scope.logout = function () {
      logoutModal.show();
    };

    $scope.confirmLogout = function () {
      $cookies.remove("token");
      logoutModal.hide();
      setTimeout(function () {
        $location.path("/login");
        $scope.$apply();
      }, 200);
    };
  },
);
