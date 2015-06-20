angular.module('app.home', ['app.home.addUrl', 'app.home.results', 'ui.router'])
.controller('homeController', function ($scope, $state) {
  $scope.html = '';
  $scope.add = function() {
    console.log(url.value);

    $scope.input = { somedata: '' };

    $scope.myFunc = function(value){
        $scope.input.somedata = value.toUpperCase();
    }

    $scope.html = 'newValues';
    $state.go('home.addUrl');
  }
});
