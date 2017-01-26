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

  .controller('SinglePostCtrl', function($scope, $state, $stateParams, $http, $ionicModal, $ionicPopup) {
    $scope.category = $stateParams.category;
    var postId = $stateParams.id;
    var textToSpeech = "";
    $scope.commentopen = false;
    $scope.editcommentopen = [];
    $scope.editcommentclose = [];
    $scope.menupostopen = false;
    $scope.posts = null;
    $scope.commentData = {};
    $scope.editCommentData = {};
    $scope.post = {};
    $scope.comments = {};
    $scope.user = {};
    $scope.isFav = false;
    $scope.images = [];
    $scope.videos = [];
    $scope.links = [];
    $scope.upvotes = [];
    $scope.downvotes = [];
    $scope.identified = false;

    if(window.localStorage.getItem('user') >= 0) {
      $scope.identified = true;
      var isFavLink = 'http://diyvt.leonard-peronnet.com/getfavouriteusers/' + window.localStorage.getItem('user') + "/" + postId;
      $http.get(isFavLink).then(function(res) {
        $scope.isFav = res.data;
      });
      var getUserLink = 'http://diyvt.leonard-peronnet.com/users/' + window.localStorage.getItem('user');
      $http.get(getUserLink).then(function(res) {
        $scope.user = res.data;
      });
    }

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
      textToSpeech += $scope.post.content + ". ";

      angular.forEach($scope.post.srcUrls, function(value, key) {
        if(value.endsWith(".mp4")) {
          $scope.videos.push(value);
        } else if(value.endsWith(".jpg")) {
          $scope.images.push(value);
        }
      });

      angular.forEach($scope.post.links, function(value, key) {
        $scope.links.push(value);
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
      };

      var getComments = 'http://diyvt.leonard-peronnet.com/posts/' + $stateParams.category + "/" + postId + "/comments";

      $http.get(getComments).then(function(commentsRes){
        $scope.comments = commentsRes.data;

        function compare(a,b) {
          if (a.upvote > b.upvote)
            return -1;
          if (a.upvote < b.upvote)
            return 1;
          return 0;
        }

        $scope.comments.sort(compare);

        angular.forEach($scope.comments, function(value, key) {
          textToSpeech += "Comment number " + (key+1) + ": ";
          textToSpeech += value.text + ". ";
          $scope.upvotes[key] = value.upvote;
          $scope.downvotes[key] = value.downvote;
          $scope.editcommentopen[key] = false;
          $scope.editcommentclose[key] = true;
        });
      });
    });

    $scope.speakText = function() {
      window.TTS.speak({
        text: textToSpeech,
        locale: 'en-GB',
        rate: 1
      }, function () {
        // Do Something after success
      }, function (reason) {
        // Handle the error case
        alert(reason+"");
      });
    };

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
        $state.reload();
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
          $state.go('app.singlepost', {category: $stateParams.category, id: postId});
          $scope.isFav = true;
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
          $state.go('app.singlepost', {category: $stateParams.category, id: postId});
          $scope.isFav = false;
        }
      });
    };

    $scope.goToAddPost = function() {
      $state.go('app.newpost', {category: $stateParams.category});
    };

    $scope.editPost = function(postId) {
      $ionicPopup.show({
        template: '<textarea rows="5" ng-model="post.content"></textarea>',
        title: 'Edit post',
        subTitle: 'You can edit the content of your post',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Edit</b>',
            type: 'button-positive',
            onTap: function(e) {
              if (!$scope.post.content) {
                e.preventDefault();
              } else {
                var editPostLink = 'http://diyvt.leonard-peronnet.com/post/update/' + postId;

                var text = $scope.post.content;

                var data = {
                  text: text
                };

                $http.post(editPostLink, data).then(function (res){
                  $state.reload();
                });
              }
            }
          }
        ]
      });
    };

    $scope.deletePost= function(postId) {
      $ionicPopup.show({
        template: 'Are you sure you want to delete this post ?',
        title: 'Delete post',
        scope: $scope,
        buttons: [
          {
            text: 'Delete post',
            type: 'button-positive',
            onTap: function() {
              var deleteLink = 'http://diyvt.leonard-peronnet.com/posts/' + $stateParams.category + '/' + postId;

              $http.delete(deleteLink).then(function (res){
                $state.go('app.post', {category: $stateParams.category});
              });
            }
          },
          { text: 'Cancel' }
        ]
      });
    };

    $scope.upvoteComment = function(commentId, index) {
      var userId = window.localStorage.getItem('user');
      var upvoteLink = 'http://diyvt.leonard-peronnet.com/upvote/comment/' + commentId + '/' + userId;

      $http.post(upvoteLink).then(function (res){
        if(res.data != "already_upvoted") {
          $scope.upvotes[index] = res.data;
        }
      });
    };

    $scope.downvoteComment = function(commentId, index) {
      var userId = window.localStorage.getItem('user');
      var downvoteLink = 'http://diyvt.leonard-peronnet.com/downvote/comment/' + commentId + '/' + userId;

      $http.post(downvoteLink).then(function (res){
        if(res.data != "already_downvoted") {
          $scope.downvotes[index] = res.data;
        }
      });
    };

    $scope.openEditComment = function(index) {
      $scope.editcommentopen[index] = true;
      $scope.editcommentclose[index] = false;
      $scope.editCommentData.content = $scope.comments[index].text;
    };

    $scope.closeEditComment = function(index) {
      $scope.editcommentopen[index] = false;
      $scope.editcommentclose[index] = true;
      $scope.editCommentData.content = {};
    };

    $scope.editComment = function(commentId) {
      var editCommentLink = 'http://diyvt.leonard-peronnet.com/edit/comment/' + commentId;

      var text = $scope.editCommentData.content;

      var data = {
        text: text
      };

      $http.post(editCommentLink, data).then(function (res){
        $state.reload();
      });
    };

    $scope.deleteComment = function(commentId) {
      var deleteLink = 'http://diyvt.leonard-peronnet.com/delete/comment/' + commentId;

      $http.post(deleteLink).then(function (res){
        $state.reload();
      });
    };

    $scope.goToNewLink = function(wantedLink) {
      window.open(wantedLink,'_blank','location=yes');
      return false;
    }
  });
