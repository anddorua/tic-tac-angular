/**
 * Created by ����� on 24.10.15.
 */
angular.module('tt', ['ngRoute', 'ngAnimate'])
    .config(function($routeProvider){
        $routeProvider
            .when('/start', {})
            .when('/progress/:humanSide', {})
            .when('/finish', {})
            .otherwise({
                redirectTo: '/start'
            });
    });