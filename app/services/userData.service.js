app.service("UserService", function () {
    var selectedUser = null;
  
    this.setSelectedUser = function (user) {
      selectedUser = user;
    };
  
    this.getSelectedUser = function () {
      return selectedUser;
    };
  });
  