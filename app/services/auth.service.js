app.service("AuthService", function ($cookies) {
  this.isAuthenticated = function () {
    return !!$cookies.get("token");
  };

  this.getToken = function () {
    return $cookies.get("token");
  };
});
