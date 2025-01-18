app.controller(
  "DashboardController",
  function ($scope, $http, $location, $cookies, UserService) {
    $scope.welcomeMessage = "به پنل مدیریت خوش آمدید";
    var logoutModal;

    // Fetch user data
    function fetchUserData() {
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
        });
    }

    $scope.showUsers = false;
    $scope.users = [];

    $scope.loadUsers = function () {
      console.log("loadUsers function called");
      $http({
        method: "GET",
        url: "/api/user/contacts",
        headers: {
          Authorization: "Bearer " + $cookies.get("token"),
        },
      })
        .then(function (response) {
          console.log("API response:", response);
          if (response.data.success) {
            $scope.users = response.data.contacts;
            $scope.showUsers = true;
          }
        })
        .catch(function (error) {
          console.error("Error loading users:", error);
          if (error.status === 401) {
            $cookies.remove("token");
            $location.path("/login");
          }
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
      $location.path("/login");
    };
  }
);
