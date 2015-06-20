angular.module('app.home.addUrl', [ 'ui.router'])
.controller('addUrlController', function ($scope, $state, $http) {
  $scope.html = '';

  $scope.add = function() {

      console.log(url.value);
      // Simple POST request example (passing data) :
      $http.post('/api/users/addUrl', {url: url.value}).
        success(function(data, status, headers, config) {
          // this callback will be called asynchronously
          // when the response is available
          console.log(data);
        }).
        error(function(data, status, headers, config) {
          console.log(data);
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });

  };
});
