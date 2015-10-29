/**
 * Created by Такси on 26.10.15.
 */
angular.module('tt')
    .directive('adGameField', ['$animateCss', '$q', function($animateCss, $q){
        return {
            template: '<canvas width="{{width}}" height="{{height}}">Fail: tag <pre><canvas></pre> not supported.</canvas>',
            restrict: 'E',
            scope: {
                game: '=',
                width: '@',
                height: '@',
                onClickPlace: '&'
            },
            link: function(scope, element, attrs){

                var board = element.children()[0];
                var fieldWatchStopper = null;

                var drawFieldBackground = function(cnv, cnvSection){
                    cnv.fillStyle = "#f7f7f7";
                    cnv.fillRect(0,0,cnvSection.width, cnvSection.height);
                };

                var drawSharp = function(cnv, cnvSection){
                    var size = cnvSection.width;
                    cnv.beginPath();
                    cnv.lineWidth = 3;
                    cnv.moveTo(size / 3, 0); 		cnv.lineTo(size / 3, size);
                    cnv.moveTo((size / 3) * 2, 0); 	cnv.lineTo((size / 3) * 2, size);
                    cnv.moveTo(0, size / 3); 		cnv.lineTo(size, size / 3);
                    cnv.moveTo(0, (size / 3) * 2); 	cnv.lineTo(size, (size / 3) * 2);
                    cnv.strokeStyle = "#99adeb";
                    cnv.stroke();
                };

                var drawCharInMiddle = function(x, y, letter, cnv, cnvSection) {
                    var size = cnvSection.height / 3 * 0.6;
                    cnv.font = "" + size + "px Lucida Console, monospace";
                    cnv.textAlign = "center";
                    cnv.textBaseline = "middle";
                    cnv.fillStyle = "black";
                    cnv.fillText(letter, x, y);
                };

                var getPlaceX = function(place, cnvSection){
                    var size = cnvSection.width;
                    return (place % 3) * size / 3 + size / 6;
                };

                var getPlaceY = function(place, cnvSection){
                    var size = cnvSection.width;
                    return Math.floor(place / 3) * size / 3 + size / 6;
                };

                var drawFieldFigures = function(fieldToDraw, cnv, cnvSection){
                    var cells = fieldToDraw.getCells();
                    for (var place = 0; place < cells.length; place++) {
                        if (cells[place] != -1) {
                            drawCharInMiddle(getPlaceX(place, cnvSection), getPlaceY(place, cnvSection), cells[place] == 1 ? "X" : "O", cnv, cnvSection);
                        }
                    }
                };

                var drawFinishLine = function(field, cnv, cnvSection){
                    var finished = field.getLines().filter(function(line){ return line.isFinished() !== false; });
                    if (finished.length > 0) {
                        var place1 = finished[0].getCells()[0].place;
                        var place2 = finished[0].getCells()[2].place;
                        var x1 = getPlaceX(place1, cnvSection);
                        var y1 = getPlaceY(place1, cnvSection);
                        var x2 = getPlaceX(place2, cnvSection);
                        var y2 = getPlaceY(place2, cnvSection);

                        var k = 1.15;
                        var lx1 = (x1 - x2) * k + x2;
                        var ly1 = (y1 - y2) * k + y2;
                        var lx2 = (x2 - x1) * k + x1;
                        var ly2 = (y2 - y1) * k + y1;

                        cnv.beginPath();
                        cnv.lineWidth = 4;
                        cnv.moveTo(lx1, ly1);
                        cnv.lineTo(lx2, ly2);
                        cnv.strokeStyle = "#ff3300";
                        cnv.stroke();
                    }
                };

                var render = function(cnvSection){
                    var cnv = cnvSection.getContext("2d");
                    drawFieldBackground(cnv, cnvSection);
                    drawSharp(cnv, cnvSection);
                    if (scope.game && (['progress', 'finished'].indexOf(scope.game.getState()) != -1)) {
                        drawFieldFigures(scope.game.getField(), cnv, cnvSection);
                    }
                    if (scope.game && scope.game.getState() == 'finished') {
                        if (scope.game.getWinner() != -1) {
                            drawFinishLine(scope.game.getField(), cnv, cnvSection);
						}
                    }
                };

                var mouseClickHandler = function(e){
					scope.$apply(function(){
						var size = element.children()[0].width;
						var cellX = Math.floor(e.offsetX / (size / 3));
						var cellY = Math.floor(e.offsetY / (size / 3));
						var absoluteCell = cellY * 3 + cellX;
						scope.onClickPlace({place:absoluteCell});
					});
                };

                var stopHandling = function(){
                    if (fieldWatchStopper) {
                        fieldWatchStopper();
                        fieldWatchStopper = null;
                    }
                    element.off('click', mouseClickHandler);
                };

                var doStage1 = function(el){
                    var deferred = $q.defer();
                    var promise = deferred.promise;
                    //console.log('stage1 preparation');
                    $animateCss(el, {
                        addClass:'rolling',
                        from: {
                            '-webkit-transform': 'rotateY( 1deg )',
                            '-moz-transform': 'rotateY( 1deg )',
                            '-ms-transform': 'rotateY( 1deg )',
                            '-o-transform': 'rotateY( 1deg )',
                            'transform': 'rotateY( 1deg )'
                        },
                        to: {
                            '-webkit-transform': 'rotateY( 90deg )',
                            '-moz-transform': 'rotateY( 90deg )',
                            '-ms-transform': 'rotateY( 90deg )',
                            '-o-transform': 'rotateY( 90deg )',
                            'transform': 'rotateY( 90deg )'
                        },
                        duration: 0.5
                    }).start().then(function(){
                        //console.log('stage1 finished');
                        deferred.resolve(el);
                    });
                    return promise;
                };

                var doStage2 = function(el){
                    var deferred = $q.defer();
                    var promise = deferred.promise;
                    //console.log('stage2 preparation');
                    $animateCss(el, {
                        addClass:'rolling',
                        from: {
                            '-webkit-transform': 'rotateY( -90deg )',
                            '-moz-transform': 'rotateY( -90deg )',
                            '-ms-transform': 'rotateY( -90deg )',
                            '-o-transform': 'rotateY( -90deg )',
                            'transform': 'rotateY( -90deg )'
                        },
                        to: {
                            '-webkit-transform': 'rotateY( 0deg )',
                            '-moz-transform': 'rotateY( 0deg )',
                            '-ms-transform': 'rotateY( 0deg )',
                            '-o-transform': 'rotateY( 0deg )',
                            'transform': 'rotateY( 0deg )'
                        },
                        duration: 0.5,
                        applyClassesEarly: true
                        //cleanupStyles: true
                    }).start().then(function(){
                        //console.log('stage2 finished');
                        deferred.resolve(el);
                    });
                    return promise;
                };

                var clearTransition = function (el) {
                    el.removeClass('rolling');
                    return el;
                };

                var doFlip = function(boardContainer){
                    return doStage1(boardContainer)
                        .then(function(el){ render(board); return el; })
                        .then(function(el){return doStage2(el)})
                        .then(clearTransition);
                };

                scope.$watch(scope.game.getState, function(newState, oldState){
                    switch(newState) {
                        case 'progress':
                            element.on('click', mouseClickHandler);
                            fieldWatchStopper = scope.$watchCollection(scope.game.getField().getCells, function(){
                                render(board);
                            });
                            break;
						case 'wait_new_game':
							stopHandling();
                            doFlip(angular.element(board));
							break;
                        default:
                            stopHandling();
                            render(board);
                            break;
                    }
                });

            }
        };
    }]);