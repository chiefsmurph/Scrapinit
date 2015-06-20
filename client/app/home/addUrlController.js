angular.module('app.home.addUrl', [ 'ui.router'])
.controller('addUrlController', function ($scope, $state, $http) {

 $scope.html = '';

 $scope.add = function() {
     var loginUrl = '/api/users/addUrl';
     console.log('urlCtrl');
     $http.post(loginUrl, {url: $scope.url })
       .success(function (data) {
         console.log(data);
         $('#resultimg').attr("src",data);
         $state.go('home.addUrl');
       });
 };
});
