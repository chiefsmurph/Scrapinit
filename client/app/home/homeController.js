angular.module('app.home', ['app.home.addUrl', 'app.home.results', 'ui.router'])
.controller('homeController', function ($scope, $state, $http) {

   $scope.html = '';
   $scope.url = 'http://';
   $scope.urls = [];
   $scope.loading = false;
   console.log($scope.urls);

   // load current urls
   $http.get('/api/users/list')
    .success(function(data) {
      var urls = data.urls;
      for (var i = 0; i < urls.length; i++) {
        $scope.urls.push({url: urls[i].url, img: urls[i].UserUrl.cropImage});
      }
    });


   // request current users' urls from server right now on init

   $scope.logout = function() {
     $http.get("/api/users/logout")
       .success(function (data) {
         $state.go('login');
       });
   }

   $scope.add = function() {

      $scope.theframe = $scope.url;
      $scope.loading = true;

      //  console.log($scope.urls);
       $http.post('/api/screenshot', {url: $scope.url} )
         .success(function (data) {

            console.log('received response from server: ' + data);

           var img = $("<img src='" + data + "' />");
           $('#imgview').html(img);
           $('#imgview').fadeIn(100);

           var selectedCrop = function(c) {
             $('#imgview').fadeOut(800);
             $http.post('/api/users/url', {crop: c, urlImg: data, url: $scope.url})
                .success(function (data) {
                  console.log('url response: ' + JSON.stringify(data));
                  if (data !== 'error') {
                    $scope.urls.push({url: $scope.url, img: data[0][0].cropImage});
                  }
                  $scope.loading = false;
                })
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
   };

});
