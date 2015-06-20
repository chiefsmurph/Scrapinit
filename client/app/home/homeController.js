angular.module('app.home', ['app.home.addUrl', 'app.home.results', 'ui.router'])
.controller('homeController', function ($scope, $state, $http) {

   $scope.html = 'dsa';
   $scope.urls = ['as', 'ds'];
   console.log($scope.urls);
   $scope.add = function() {
       $scope.urls.push($scope.url);
       var loginUrl = '/api/users/addUrl';
       console.log($scope.urls);
       $http.post(loginUrl, {url: $scope.url })
         .success(function (data) {
           console.log(data);
           $scope.html = data;
         });
   };

});
