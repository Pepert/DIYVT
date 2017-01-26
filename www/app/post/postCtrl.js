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
    switch($stateParams.category) {
      case "personalstories":
        $scope.category = "Personal stories";
        break;
      case "scientific":
        $scope.category = "Scientific";
        break;
      case "vtbooks":
        $scope.category = "VT books";
        break;
      case "search":
        $scope.category = "Search";
        break;
      default:
        $scope.category = $stateParams.category;
    }

    $scope.menupostopen = false;
    $scope.posts = null;
    $scope.commentData = {};
    $scope.identified = false;
    $scope.searchData =  {};

    $scope.searchData.content = "";

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

    console.log($scope.category);

    if(window.localStorage.getItem('search') != null) {

      $scope.category = "Search result";
      var searchLink = 'http://diyvt.leonard-peronnet.com/post/search';

      var search = window.localStorage.getItem('search');
      window.localStorage.removeItem('search');

      var data = {
        search: search
      };

      $http.post(searchLink, data).then(function (res){
        if(res.data) {
          $scope.posts = res.data;
        }
      });
    }
    else {
      var link = 'http://diyvt.leonard-peronnet.com/posts/' + $stateParams.category;

      $http.get(link).then(function(res){
        console.log(res.data);
        if(res.data) {
          $scope.posts = res.data;
        }
      });
    }

    $scope.goToPost = function(postId) {
      window.localStorage.removeItem('search');
      $state.go('app.singlepost', {category: $scope.category, id: postId});
    };

    $scope.goToAddPost = function() {
      window.localStorage.removeItem('search');
      $state.go('app.newpost', {category: $scope.category});
    };

    $scope.searchTerm = function() {
      var search = $scope.searchData.content;
      window.localStorage.setItem('search', search);
      $state.reload();
    };
  });
