// Define the AuthInterceptor factory
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
        }
        console.log(config);
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
