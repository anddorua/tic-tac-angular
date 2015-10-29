/**
 * Created by ����� on 24.10.15.
 */
angular.module('tt')
    .controller('SampleCtrl', ['$scope', function($scope){
        $scope.items = [
            {iName: 'Bob', iData: 15},
            {iName: 'Feth', iData: 25},
            {iName: 'Kira', iData: 45}
        ];
    }]);
