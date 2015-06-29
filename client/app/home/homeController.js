angular.module('app.home', ['app.home.addUrl', 'app.home.results', 'ui.router', ])
.controller('homeController', function ($scope, $state, $http, Url) {


   $scope.url = 'http://';
   $scope.urls = [];
   $scope.loading = false;
   console.log($scope.urls);


   $scope.logout = function() {
     $http.get("/api/users/logout")
       .success(function (data) {
         $state.go('login');
       });
   };


  $scope.removeUrl = function(url) {
    for (var i = 0; i < $scope.urls.length; i++) {
      if ($scope.urls[i].url === url) {
        $scope.urls.splice(i, 1);
        break;
      }
    }
  }


  $scope.setUrls = function(urlsObject){
    $scope.urls = urlsObject;
  };

   $scope.add = function() {

      $scope.theframe = $scope.url;
      $scope.loading = true;

      //  console.log($scope.urls);
       $http.get('/api/screenshot?url=' + $scope.url )
         .success(function (data) {

            console.log('received response from server: ' + data);

           var img = $("<img src='" + data + "' style='width: 1024px' />");
           $('#imgview').html(img);
           $('#imgview').fadeIn(100);

           var selectedCrop = function(c) {

             console.log('b4 ' + JSON.stringify(c));
             for (key in c) {
               c[key] = c[key] * 2;
             }
             console.log('after ' + JSON.stringify(c));

             $('#imgview').fadeOut(800);
             $http.post('/api/users/url', {crop: c, urlImg: data, url: $scope.url})
                .success(function (data) {
                  console.log('url response: ' + JSON.stringify(data));
                  if (data !== 'error') {
                    console.log(JSON.stringify(data));

                    // check to see if url has already been added, if so update instead of pushing

                    var foundId = -1;
                    for (var i = 0; i < $scope.urls.length; i++) {
                      if ($scope.urls[i].url === $scope.url) {
                        foundId = i;
                      }
                    }

                    if (foundId > -1) {
                      $scope.urls[foundId].img = data.cropImage + '?' + new Date().getTime();
                      $scope.urls[foundId].text = data.text;
                    } else {
                      $scope.urls.push({url: $scope.url, img: data.cropImage, text: data.text});
                    }

                    //$scope.urls.push({url: $scope.url, img: data.cropImage});
                  }
                  $scope.loading = false;
                })  // end http post success
                .error(function(err) {
                    console.log('error loading url');
                });
           };

         	 img.Jcrop({
              onSelect: selectedCrop
           });

         });

         // $http.post('/api/users/retrieve_url', {url: $scope.url })
         //   .success(function (data) {
         //     //console.log(data);
         //     $scope.html = data;
         //    //  var ifrm = document.getElementById('theframe');
         //    //  ifrm = (ifrm.contentWindow) ? ifrm.contentWindow : (ifrm.contentDocument.document) ? ifrm.contentDocument.document : ifrm.contentDocument;
         //    //  ifrm.document.open();
         //    //  ifrm.document.write(data);
         //    //  ifrm.document.close();

         //   });

  Url.getUrls(function(err, urls){
    if (err) {
      $scope.error = 'We can´t retrieve the URLS';
    }else {
      $scope.setUrls(urls);
    }
  });
};
   console.log('going to results');
  $state.go('home.results');
})
.factory('Url', function ($http) {

  var getUrls = function (callback) {
    $http({
      method: 'GET',
      url: '/api/users/list'
    })
    .success(function(data) {
      var urls = [];
      var urlArray = data.urls;
      console.log('data - ', data);
      for (var i = 0; i < urlArray.length; i++) {
        urls.push({url: urlArray[i].url, img: urlArray[i].UserUrl.cropImage, text: urlArray[i].UserUrl.webImage});
      }
      callback(false, urls);
    })
    .error(function(err) {
      callback(true);
    });
  };

  var removeUrl = function(url, callback) {
    $http.post('/api/users/removeUrl', {url: url})
       .success(function (data) {
         console.log('SUCCESS REMOVAL');
         callback(true);
       })
       .error(function(err) {
         callback(false);
       });
  }

  return {
    getUrls: getUrls,
    removeUrl: removeUrl
  }

});
