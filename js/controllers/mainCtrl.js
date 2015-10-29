/**
 * Created by Такси on 24.10.15.
 */
angular.module('tt').controller('MainCtrl',['$scope', '$route', '$routeParams', '$location', 'game',
    function($scope, $route, $routeParams, $location, game){
        $scope.game = game;
        $scope.$on('$routeChangeSuccess', function(evt, current){
            var locationChain = $location.path().split('/');
            switch(locationChain[1]) {
                case 'start':
                    game.setWaitNewGameState();
                    break;
                case 'progress':
                    game.setProgressState($routeParams.humanSide);
                    break;
            }
        });
        $scope.fieldClickHandler = function (place) {
			game.makeHumanMove(place);
        }
		$scope.flipped = false;
		$scope.clickHandler = function(){
			$scope.flipped = !$scope.flipped;
			console.log('flipped=', $scope.flipped);
		};
    }
]);