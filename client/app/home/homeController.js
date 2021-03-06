angular.module('app.home', ['app.home.addUrl', 'app.home.results', 'ui.router'])
.controller('homeController', function ($scope, $state, $http) {

   $scope.html = '';
   $scope.url = 'http://';
   $scope.urls = [];
   $scope.loading = false;
   console.log($scope.urls);

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
       $http.get('/api/getScreenshot?url=' + $scope.url )
         .success(function (data) {

            if (data !== 'error') {
              $scope.urls.push($scope.url);
            }
            $scope.loading = false;
            console.log('received response from server: ' + data);

           var img = $("<img src='" + data + "' />");
           $('#imgview').append(img);
           $('#imgview').show();

           var selectedCrop = function(c) {
             $('#imgview').fadeOut(5000);
             $http.post('/api/cropImg', {crop: c, urlImg: data})
                .success(function (data) {

                })
             console.log(c.x, c.y, c.w, c.h);
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
