define(['angular', 'js/controllers',  'js/animations',  'js/directives', 'js/common/config'],
    function (angular) {

        var app = angular.module('Connect', ['ngRoute', 'controllers', 'animations', 'directives']);
        app.config(['$routeProvider',
            function($routeProvider) {
                $routeProvider.
                when('/login', {
                    templateUrl: 'partials/login.html',
                    controller: 'LoginCtrl'
                }).
                when('/', {
                    templateUrl: 'partials/comcenter.html'//,
                }).
                otherwise({
                    redirectTo: '/login'
                });
        }])
        .run(['$rootScope', '$location',
            function ($rootScope, $location) {
                $rootScope.globals = {};
                $rootScope.$on('$routeChangeStart', function (event, next, current) {
                    // redirect to login page if not logged in
                    if ($location.path() !== '/login' && !$rootScope.globals.currentUser) {
                        $location.path('/login');
                    }
                });
            }
        ]);

        var init = function(){
          angular.bootstrap(document, ['Connect']);
          $('html').attr('ng-app', 'Connect');
        };

    return {
        init:init
    }
});
