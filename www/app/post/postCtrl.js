angular.module('diyvt.postCtrl', [])

  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('app.post', {
        cache: false,
        url: '/post/:category',
        views: {
          'menuContent': {
            templateUrl: 'app/post/post.html',
            controller: 'PostCtrl'
          }
        }
      });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('app.post');
  })

  .controller('PostCtrl', function($scope, $state, $stateParams, $http) {
    $scope.category = $stateParams.category;
    $scope.menupostopen = false;
    $scope.posts = null;
    $scope.commentData = {};
    $scope.identified = false;

    if(window.localStorage.getItem('user') >= 0) {
      $scope.identified = true;
    }

    console.log(window.localStorage.getItem('user'));

    $scope.options = function() {
      if(!$scope.menupostopen) {
        $scope.menupostopen = true;
      } else {
        $scope.menupostopen = false;
      }
    };

    var link = 'http://diyvt.leonard-peronnet.com/posts/' + $stateParams.category;

    $http.get(link).then(function(res){
      if(res.data) {
        $scope.posts = res.data;
      }
    });

    $scope.goToPost = function(postId) {
      $state.go('app.singlepost', {category: $stateParams.category, id: postId});
    };

    $scope.goToAddPost = function() {
      $state.go('app.newpost', {category: $stateParams.category});
    };
  });
