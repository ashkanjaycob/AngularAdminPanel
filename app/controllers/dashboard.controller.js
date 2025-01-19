app.controller(
  "DashboardController",
  function ($scope, $http, $location, $cookies, UserService) {
    $scope.welcomeMessage = "به پنل مدیریت خوش آمدید";

    $scope.breadcrumbs = [
      { label: 'مدیریت', url: '/dashboard' },
      { label: 'کاربران', url: '/users' },
    ];
    
    $scope.$on('$routeChangeSuccess', function(event, currentRoute) {
      const path = currentRoute.originalPath; 
      if (path === '/users') {
        $scope.breadcrumbs = [
          { label: 'مدیریت', url: '/dashboard' },
          { label: 'کاربران', url: '/users' },
        ];
      }
    });
    
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
          console.log("API Response:", response.data);
          if (response.data.success) {
            $scope.userData = response.data.user;
            response.data.user.avatar =
              "https://www.shopgram123.ir" + response.data.user.avatar;
            $scope.userData = response.data.user;
            console.log("User Data:", response.data.user);
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
      console.log("loadUsers function called");
      $http({
        method: "GET",
        url: "/api/manage/users",
        headers: {
          Authorization: "Bearer " + $cookies.get("token"),
        },
      })
        .then(function (response) {
          console.log("API response:", response);
          if (response.data.success) {
            $scope.users = response.data.users;
            $scope.showUsers = true;
          }
        })
        .catch(function (error) {
          console.error("Error loading users:", error);
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
        console.error("User or user ID is not defined.");
        return;
      }

      $scope.userToDelete = user; // ذخیره کاربر برای تأیید حذف
      const deleteModal = new bootstrap.Modal(
        document.getElementById("deleteUserModal")
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
          console.log("User deleted successfully:", response);
          if (response.data.success) {
            $scope.users = $scope.users.filter(
              (user) => user.id !== $scope.userToDelete.id
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
        $location.path("/edituser");
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
        console.log("Logging out...");
        $cookies.remove("token");
        logoutModal.hide();
        setTimeout(function () {
            $location.path("/login");
            $scope.$apply();
        }, 200);
    };
    $scope.confirmLogoutaaa = function () {
      console.log("sadasd");
      
    }
  }
);
