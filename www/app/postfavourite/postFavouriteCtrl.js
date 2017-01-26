angular.module('diyvt.postFavouriteCtrl', [])

  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('app.favouritepost', {
        cache: false,
        url: '/favourites',
        views: {
          'menuContent': {
            templateUrl: 'app/postfavourite/postFavourite.html',
            controller: 'PostFavouriteCtrl'
          }
        }
      });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('app.favouritepost');
  })

  .controller('PostFavouriteCtrl', function($scope, $state, $http) {
    $scope.menupostopen = false;
    $scope.posts = null;
    $scope.commentData = {};

    $scope.options = function() {
      if(!$scope.menupostopen) {
        $scope.menupostopen = true;
      } else {
        $scope.menupostopen = false;
      }
    };

    var link = 'http://diyvt.leonard-peronnet.com/favourites';

    var userId = window.localStorage.getItem('user');
    if(userId == null || userId == -1) {
      $state.go('app.login');
    }

    var data = {
      user_id: userId
    };

    $http.post(link, data).then(function(res){
      $scope.posts = res.data;
    });

    $scope.goToPost = function(category, postId) {
      $state.go('app.singlepost', {category: category, id: postId});
    };

    $scope.goToAddPost = function() {
      $state.go('app.newpost');
    };
  });
