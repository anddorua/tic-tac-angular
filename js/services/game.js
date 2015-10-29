/**
 * Created by Такси on 25.10.15.
 */
angular.module('tt')
    .factory('game', function(){
        var state = null;
        var humanSide = null;
        var game = null;
        var startTime = null;

        var setProgressState = function(aHumanSide) {
            state = "progress";
            startTime = new Date();
            humanSide = aHumanSide;
            game = new TTTGame(humanSide, TTTField, TTTLine);
            if (humanSide == 0) {
                makeComputerMove();
            }
        };

        var setFinishedState = function(){
            state = "finished";
        };

        var setWaitNewGameState = function(){
            state = 'wait_new_game';
            humanSide = null;
            game = null;
        };

        var makeComputerMove = function() {
            game.makeComputerMove();
            if (game.isFinished()) {
                setFinishedState();
            }
        };

        var makeHumanMove = function(place){
            var result = false;
            if (state == "progress") {
                if (game.makeHumanMove(place)) {
                    if (game.isFinished()) {
                        setFinishedState();
                    } else {
                        makeComputerMove();
                    }
                    result = true;
                }
            }
            return result;
        };

        setWaitNewGameState();

        return {
            getState: function(){
                return state;
            },
            getField: function(){
                return game.getField();
            },
            getTimePassedStart: function(){
                return new Date(Date.now() - startTime);
            },
            getWinner: function(){
                return game ? game.getWinner() : -1;
            },
			getHumanKind: function(){
				return game ? game.getHumanKind() : -1;
			},
			getComputerKind: function(){
				return game ? game.getComputerKind() : -1;
			},
            setWaitNewGameState: setWaitNewGameState,
            setProgressState: setProgressState,
            makeHumanMove: makeHumanMove
        };
    });