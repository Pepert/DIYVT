angular.module('diyvt.singlepostCtrl', [])

  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('app.singlepost', {
        cache: false,
        url: '/singlepost/:category/:id',
        views: {
          'menuContent': {
            templateUrl: 'app/singlepost/singlePost.html',
            controller: 'SinglePostCtrl'
          }
        }
      });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('app.singlepost');
  })

  .controller('SinglePostCtrl', function($scope, $state, $stateParams, $http, $ionicModal, $cordovaFileTransfer) {
    $scope.category = $stateParams.category;
    var postId = $stateParams.id;
    $scope.commentopen = false;
    $scope.menupostopen = false;
    $scope.posts = null;
    $scope.commentData = {};
    $scope.images = [];
    $scope.videos = [];

    $scope.options = function() {
      if(!$scope.menupostopen) {
        $scope.menupostopen = true;
      } else {
        $scope.menupostopen = false;
      }
    };

    var link = 'http://diyvt.leonard-peronnet.com/posts/' + $stateParams.category + "/" + postId;

    $http.get(link).then(function(res){
      $scope.post = res.data;

      angular.forEach($scope.post.srcUrls, function(value, key) {
        if(value.endsWith(".mp4")) {
          $scope.videos.push(value);
        } else if(value.endsWith(".jpg")) {
          $scope.images.push(value);
        }
      });

      $scope.showImages = function(index) {
        $scope.activeSlide = index;
        $scope.showModal('templates/image-popover.html');
      };

      $scope.showModal = function(templateUrl) {
        $ionicModal.fromTemplateUrl(templateUrl, {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          $scope.modal = modal;
          $scope.modal.show();
        });
      };

      // Close the modal
      $scope.closeModal = function() {
        $scope.modal.hide();
        $scope.modal.remove()
      };

      $scope.playVideo = function(index) {
        $scope.videoIndex = index;
        $scope.showModal('templates/video-popover.html');
      }
    });

    $scope.openComment = function() {
      $scope.commentopen = true;
    };

    $scope.closeComment = function() {
      $scope.commentopen = false;
    };

    $scope.postComment = function(postId) {
      var commentLink = 'http://diyvt.leonard-peronnet.com/posts/' + $stateParams.category + "/" + postId + "/comments";

      var text = $scope.commentData.content;
      var upvote = 0;
      var downvote = 0;
      var userId = window.localStorage.getItem('user');


      var newComment = {
        text: text,
        upvote: upvote,
        downvote: downvote
      };

      var data = {
        user_id: userId,
        comment: newComment
      };

      $http.post(commentLink, data).then(function (res){
        console.log('nouveau comment enregistré');
        $state.go('app.singlepost', {category: $stateParams.category, id: postId});
      });
    };

    $scope.addToFavourites = function(postId) {
      var favouriteLink = 'http://diyvt.leonard-peronnet.com/addfavourite/' + postId;

      var userId = window.localStorage.getItem('user');

      var data = {
        user_id: userId
      };

      $http.post(favouriteLink, data).then(function (res){
        if(res.data) {
          console.log(res.data);
          console.log('Article favoris ajouté');
          $state.go('app.singlepost', {category: $stateParams.category, id: postId});
        }
      });
    };

    $scope.deleteFromFavourites = function(postId) {
      var deleteFavLink = 'http://diyvt.leonard-peronnet.com/deletefavourite/' + postId;

      var userId = window.localStorage.getItem('user');

      var data = {
        user_id: userId
      };

      $http.post(deleteFavLink, data).then(function (res){
        if(res.data) {
          console.log(res.data);
          console.log('Article correctement supprimé');
          $state.go('app.singlepost', {category: $stateParams.category, id: postId});
        }
      });
    };

    $scope.goToAddPost = function() {
      $state.go('app.newpost');
    };
  });
