app.controller("DashboardController", function ($scope, $location, $cookies) {
    $scope.welcomeMessage = "به پنل مدیریت خوش آمدید";

    $scope.logout = function() {
        $cookies.remove('token');
        $location.path('/login');
    };


    angular.element(document).ready(function () {
        // Handle sidebar close on mobile when clicking nav items
        var sidebarEl = document.getElementById('sidebar');
        var sidebar = bootstrap.Offcanvas.getOrCreateInstance(sidebarEl);
        
        if (window.innerWidth < 992) { 
            var links = sidebarEl.querySelectorAll('.nav-link');
            links.forEach(function(link) {
                link.addEventListener('click', function() {
                    sidebar.hide();
                });
            });
        }
    });
});
