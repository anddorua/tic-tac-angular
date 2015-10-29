/**
 * Created by Такси on 24.10.15.
 */
angular.module('tt').controller('HeadCtrl',['$scope', '$location', '$interval', 'game',
    function($scope, $location, $interval, game){
        $scope.$location = $location;
        $scope.game = game;
        $scope.goProgress = function(humanSide) {
            $location.path('/progress/' + humanSide);
        };
        $scope.goFinish = function() {
            $location.path('/finish');
        };
        $scope.goStart = function() {
            $location.path('/start');
        };
        $scope.timePassedStart = null;
        var timeHandler = null;
        var refreshTimer = function(){
            $scope.timePassedStart = game.getTimePassedStart();
        };
        $scope.$watch(game.getState, function(newState){
            if (newState == 'progress') {
                timeHandler = $interval(refreshTimer, 1000);
                refreshTimer();
            } else {
                $interval.cancel(timeHandler);
            }
        });
    }
]);