angular.module('diyvt.addPostCtrl', [])

  .config(function($stateProvider, $urlRouterProvider) {

    $stateProvider

      .state('app.newpost', {
        cache: false,
        url: '/newpost/:category',
        views: {
          'menuContent': {
            templateUrl: 'app/addpost/addPost.html',
            controller: 'AddPostCtrl'
          }
        }
      });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/newpost');
  })

  .controller('AddPostCtrl', function(
    $scope,
    $http,
    $state,
    $stateParams,
    $cordovaCamera,
    $cordovaFile,
    $cordovaFileTransfer,
    $cordovaDevice,
    $ionicPopup,
    $ionicLoading
  ) {
    $scope.postData = {};
    $scope.medias = {};
    $scope.thumbnails = {};
    $scope.videoThumbnails = {};
    $scope.links = {};
    $scope.data = {};
    var post;
    $scope.fromCategory = $stateParams.category;
    $scope.categories = [
      {value: "Personal stories", name: "Personal stories"},
      {value: "Scientific", name: "Scientific"},
      {value: "VT books", name: "VT books"},
      {value: "VT exercises", name: "VT exercises"},
      {value: "VT tools", name: "VT tools"},
      {value: "Optics", name: "Optics"},
      {value: "Conditions & symptoms", name: "Conditions & symptoms"},
      {value: "VT or eye surgery", name: "VT or eye surgery"},
      {value: "Tips to foster VT", name: "Tips to foster VT"}
    ];
    $scope.subcategories = [
      {value: "sub1", name: "sub1"},
      {value: "sub2", name: "sub2"}
    ];
    var medias = [];
    var thumbnails = [];
    var videoThumbnails = [];
    var urls = [];
    var links = [];
    var options = {};

    /*
    $scope.updateSubcategories = function() {
      $scope.subcategory = $scope.postData.category;
    };
    */

    $scope.loadMedia = function() {
      $ionicPopup.show({
        template: '<p>Select the media type you want to attach</p>',
        title: 'Select media type',
        scope: $scope,
        cssClass: 'popup-vertical-buttons',
        buttons: [
          {
            text: 'Load Picture',
            type: 'button-positive',
            onTap: function() {
              options = {
                quality: 100,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                saveToPhotoAlbum: false
              };
              $scope.selectMedia(options);
            }
          },
          {
            text: 'Load video',
            type: 'button-positive',
            onTap: function() {
              options = {
                mediaType: Camera.MediaType.VIDEO,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY
              };
              $scope.selectMedia(options);
            }
          },
          {
            text: 'Cancel'
          }
        ]
      });
    };

    $scope.selectMedia = function(options) {

      if(options.mediaType === Camera.MediaType.VIDEO) {
        $cordovaCamera.getPicture(options).then(function(videoUrl) {

          $scope.videoUrl = videoUrl;

          var currentName = videoUrl.replace(/^.*[\\\/]/, '');

          videoUrl = "file://" + videoUrl;

          // File name only
          var d = new Date(),
            n = d.getTime(),
            newFileName =  n + ".mp4";

          if ($cordovaDevice.getPlatform() == 'Android') {
            window.FilePath.resolveNativePath(videoUrl, function(entry) {
                window.resolveLocalFileSystemURL(entry, success, fail);
                function fail(e) {
                  console.error('Error: ', e);
                }

                function success(fileEntry) {
                  var namePath = fileEntry.nativeURL.substr(0, fileEntry.nativeURL.lastIndexOf('/') + 1);
                  // Only copy because of access rights
                  $cordovaFile.copyFile(namePath, fileEntry.name, cordova.file.dataDirectory, newFileName).then(function(success){
                    medias.push(newFileName);
                    $scope.medias = medias;

                    var imageName = newFileName.slice(0, -4) + '.png';

                    var name = success.nativeURL.slice(0, -4);
                    window.PKVideoThumbnail.createThumbnail (success.nativeURL, name + '.png', function(prevSucc) {
                      thumbnails.push(imageName);
                      $scope.thumbnails = thumbnails;
                      videoThumbnails.push(imageName);
                      $scope.videoThumbnails = videoThumbnails;
                      $scope.$apply();
                    }, function(error) {
                      console.log(error);
                    });



                  }, function(error){
                    $scope.showAlert('Error', error.exception);
                  });
                }
              }, function(error) {
                console.log(error);
              }
            );
          } else {
            var namePath = videoUrl.substr(0, videoUrl.lastIndexOf('/') + 1);
            // Move the file to permanent storage
            $cordovaFile.moveFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(function(success){
              $scope.image = newFileName;
            }, function(error){
              $scope.showAlert('Error', error.exception);
            });
          }
        });
      } else {
        $cordovaCamera.getPicture(options).then(function(imagePath) {
          // Grab the file name of the photo in the temporary directory
          var currentName = imagePath.replace(/^.*[\\\/]/, '');

          //Create a new name for the photo
          var d = new Date(),
            n = d.getTime(),
            newFileName =  n + ".jpg";

          // If you are trying to load image from the gallery on Android we need special treatment!
          if ($cordovaDevice.getPlatform() == 'Android' && options.sourceType === Camera.PictureSourceType.PHOTOLIBRARY) {
            window.FilePath.resolveNativePath(imagePath, function(entry) {
                window.resolveLocalFileSystemURL(entry, success, fail);
                function fail(e) {
                  console.error('Error: ', e);
                }

                function success(fileEntry) {
                  var namePath = fileEntry.nativeURL.substr(0, fileEntry.nativeURL.lastIndexOf('/') + 1);
                  // Only copy because of access rights
                  $cordovaFile.copyFile(namePath, fileEntry.name, cordova.file.dataDirectory, newFileName).then(function(success){
                    medias.push(newFileName);
                    thumbnails.push(newFileName);
                    $scope.medias = medias;
                    $scope.thumbnails = thumbnails;
                  }, function(error){
                    $scope.showAlert('Error', error.exception);
                  });
                }
              }
            );
          } else {
            var namePath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
            // Move the file to permanent storage
            $cordovaFile.moveFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(function(success){
              $scope.image = newFileName;
            }, function(error){
              $scope.showAlert('Error', error.exception);
            });
          }
        },
        function(err){
          // Not always an error, maybe cancel was pressed...
        });
      }
    };

    $scope.pathForImage = function(image) {
      if (image === null) {
        return '';
      } else {
        return cordova.file.dataDirectory + image;
      }
    };

    $scope.addLink = function() {
      $ionicPopup.show({
        template: '<input type="text" ng-model="data.addedlink">',
        title: 'Attach a link',
        subTitle: 'Please enter the link you want to attach to the post',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Ok</b>',
            type: 'button-positive',
            onTap: function(e) {
              if (!$scope.data.addedlink) {
                e.preventDefault();
              } else {
                $scope.data.addedlink = $scope.data.addedlink.toLowerCase();
                var prefixA = 'http://';
                var prefixB = 'https://';
                if (($scope.data.addedlink.substr(0, prefixA.length) !== prefixA) && ($scope.data.addedlink.substr(0, prefixB.length) !== prefixB))
                {
                  $scope.data.addedlink = prefixA + $scope.data.addedlink;
                }


                links.push($scope.data.addedlink);
                $scope.links = links;
              }
            }
          }
        ]
      });
    };

    $scope.deleteMedia = function(index) {
      if(medias[index].endsWith('.mp4')) {
        videoThumbnails.splice(index, 1);
        $scope.videoThumbnails = videoThumbnails;
      }
      medias.splice(index, 1);
      thumbnails.splice(index, 1);
      urls.splice(index, 1);

      $scope.medias = medias;
      $scope.thumbnails = thumbnails;
    };

    $scope.goToLink = function(index) {
      console.log(links[index]);
      window.open(links[index], '_system', 'location=yes');
    };

    $scope.deleteLink = function(index) {
      links.splice(index, 1);
      $scope.links = links;
    };

    $scope.createNewPost = function(){
      if($scope.postData.category == null) {
        $ionicPopup.alert({
          title: 'No category',
          template: 'You need to select a main category associated to this post'
        });
      } else if($scope.postData.title == null || $scope.postData.content == null) {
        $ionicPopup.alert({
          title: 'Empty field',
          template: 'You need to add a title and some content'
        });
      } else {
        $ionicLoading.show({
          template: 'Loading...'
        });

        // Destination URL
        var url = "http://diyvt.leonard-peronnet.com/upload";

        if(videoThumbnails.length > 0) {
          angular.forEach(videoThumbnails, function(value) {
            // File for Upload
            var targetPath = cordova.file.dataDirectory + value;
            urls.push("http://diyvt.leonard-peronnet.com/uploads/" + value);

            // File name only
            var filename = value;

            var options = {
              fileKey: "file",
              fileName: filename,
              chunkedMode: false,
              mimeType: "multipart/form-data",
              params : {'fileName': filename}
            };

            $cordovaFileTransfer.upload(url, targetPath, options).then(function(result) {
              console.log(result);
            }, function(err) {
              console.log(err);
            });
          });
        }

        if(medias.length > 0) {
          medias.forEach(function(value, index, array) {
            // File for Upload
            var targetPath = cordova.file.dataDirectory + value;
            urls.push("http://diyvt.leonard-peronnet.com/uploads/" + value);

            // File name only
            var filename = value;

            var options = {
              fileKey: "file",
              fileName: filename,
              chunkedMode: false,
              mimeType: "multipart/form-data",
              params : {'fileName': filename}
            };

            $cordovaFileTransfer.upload(url, targetPath, options).then(function(result) {
              console.log(result);
              if (index === array.length - 1){
                $scope.showAlert('Success', 'Post upload finished.');
                medias = [];
                thumbnails = [];
                videoThumbnails = [];

                $scope.medias = medias;
                $scope.thumbnails = thumbnails;
                $scope.videoThumbnails = videoThumbnails;

                var link = 'http://diyvt.leonard-peronnet.com/posts';

                var category = $scope.postData.category;
                var subcategory = $scope.postData.subcategory;
                var title = $scope.postData.title;
                var content = $scope.postData.content;
                var userId = window.localStorage.getItem('user');

                var newPost = {
                  category: category,
                  content: content,
                  subcategory: subcategory,
                  title: title
                };

                var data = {
                  user_id: userId,
                  post: newPost,
                  urls: urls,
                  links: links
                };

                $http.post(link, data).then(function (res){
                  $ionicLoading.hide();
                  console.log('nouveau post enregistré');
                  $state.go('app.post', {category: category});
                });
              }
            }, function(err) {
              console.log(err);
            });
          });
        } else {
          var link = 'http://diyvt.leonard-peronnet.com/posts';

          var category = $scope.postData.category;
          var subcategory = $scope.postData.subcategory;
          var title = $scope.postData.title;
          var content = $scope.postData.content;
          var userId = window.localStorage.getItem('user');

          var newPost = {
            category: category,
            content: content,
            subcategory: subcategory,
            title: title
          };

          var data = {
            user_id: userId,
            post: newPost,
            urls: urls,
            links: links
          };

          $http.post(link, data).then(function (res){
            $ionicLoading.hide();
            console.log('nouveau post enregistré');
            $state.go('app.post', {category: category});
          });
        }
      }
    };

    $scope.showAlert = function(title, msg) {
      var alertPopup = $ionicPopup.alert({
        title: title,
        template: msg,
        cssClass: 'popup-regular'
      });
    };
  });
