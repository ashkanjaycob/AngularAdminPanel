app.factory("AuthInterceptor", [
  "$q",
  "$location",
  "$cookies",
  function ($q, $location, $cookies) {
    return {
      request: function (config) {
        const token = $cookies.get("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        } else if (
          config.url.includes("views") &&
          config.url !== "app/views/login.html"
        ) {
          $location.path("/login");
        }
        return config;
      },
      responseError: function (response) {
        if (response.status === 401 || response.status === 403) {
          $location.path("/login");
        }
        return $q.reject(response);
      },
    };
  },
]);
