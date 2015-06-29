angular.module('app.home.results', [])
.controller('resultsController', function ($scope, Url) {
  console.log('app home results');

  $scope.getUrls = function () {
    console.log('in home results');
    Url.getUrls(function (err, urls) {
      if (err) {
        $scope.error = 'We can´t retrieve the URLS';
      }else {
        $scope.setUrls(urls);
      }
    });
  };

  $scope.getUrls();

  $scope.remove = function(url) {
    console.log('remove url: ' + url);
    Url.removeUrl(url, function(success) {
      if (success) {
        console.log('SUCCESS!');
        $scope.removeUrl(url);
      }
    });
  }

});
