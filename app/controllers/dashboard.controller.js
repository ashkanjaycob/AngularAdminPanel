app.controller("DashboardController", function ($scope, $location, $cookies) {
    $scope.welcomeMessage = "به پنل مدیریت خوش آمدید";
    var logoutModal;

    // Initialize Bootstrap components
    angular.element(document).ready(function () {
        // Initialize the logout modal
        logoutModal = new bootstrap.Modal(document.getElementById('logoutModal'));
        
        // Handle sidebar close on mobile when clicking nav items
        var sidebarEl = document.getElementById('sidebar');
        var sidebar = bootstrap.Offcanvas.getOrCreateInstance(sidebarEl);
        
        if (window.innerWidth < 992) {
            var links = sidebarEl.querySelectorAll('.nav-link:not([ng-click])'); // Exclude logout link
            links.forEach(function(link) {
                link.addEventListener('click', function() {
                    sidebar.hide();
                });
            });
        }
    });

    // Show confirmation modal
    $scope.logout = function() {
        logoutModal.show();
    };

    // Handle confirmed logout
    $scope.confirmLogout = function() {
        $cookies.remove('token');
        logoutModal.hide();
        $location.path('/login');
    };
});
