app.controller(
  "CreateUser",
  function ($scope, $location, $http, $cookies, $timeout) {
    $scope.goBack = function () {
      $location.path("/dashboard");
    };

    $scope.newUser = {};

    function showToast(message) {
      var toastElement = document.getElementById("errorToast");
      var toastMessage = document.getElementById("toastMessage");

      if (!toastElement || !toastMessage) {
        console.error("Toast element not found in DOM.");
        return;
      }

      toastMessage.innerText = message;
      var toast = new bootstrap.Toast(toastElement, {
        animation: true,
        autohide: true,
        delay: 3000,
      });
      toast.show();
    }

    $scope.validateAndCreateUser = function () {
      const { name, mobile } = $scope.newUser;

      if (!name || name.trim().length === 0) {
        showToast("نام و نام خانوادگی نمی‌تواند خالی باشد.");
        return;
      }
      if (!/^\d{11}$/.test(mobile)) {
        showToast("شماره موبایل باید عددی و ۱۱ رقمی باشد.");
        return;
      }
      const requestData = {
        ...$scope.newUser,
        status: "approved", // اضافه کردن مقدار برای فعال بودن
      };
      $scope.createUser(requestData);
    };

    //  ایجاد کاربر
    $scope.createUser = function (requestData) {
      $scope.isLoading = true;
      $http({
        method: "POST",
        url: "/api/manage/users",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        data: requestData,
      })
        .then(function (response) {
          if (response.status === 200) {
            $scope.newUser = {};
            showToast(response.data.description);

            $timeout(function () {
              $location.path("/dashboard");
            }, 4000);
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
          $scope.isLoading = false;
        });
    };

    function showToast(message) {
      var toastElement = document.getElementById("errorToast");
      document.getElementById("toastMessage").innerText = message;
      var toast = new bootstrap.Toast(toastElement, {
        animation: true,
        autohide: true,
        delay: 2500,
      });
      toast.show();
    }
  },
);
