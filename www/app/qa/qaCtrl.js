angular.module('diyvt.qaCtrl', [])

  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('app.qa', {
        cache: false,
        url: '/qa',
        views: {
          'menuContent': {
            templateUrl: 'app/qa/qa.html',
            controller: 'QaCtrl'
          }
        }
      });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/qa');
  })

  .controller('QaCtrl', function($scope, $state) {
    if(window.localStorage.getItem('user') === null) {
      $state.go('app.login');
    }

    $scope.goToFavourite = function() {
      $state.go('app.favouritepost');
    };

    $scope.goToManagevt = function() {
      $state.go('app.managevt');
    };

    $scope.goToPersoStories = function() {
      $state.go('app.post', {category: "Personal stories"});
    };

    $scope.goToScientific = function() {
      $state.go('app.post', {category: "Scientific"});
    };

    $scope.goToVtbooks = function() {
      $state.go('app.post', {category: "VT books"});
    };

    $scope.goToQa = function() {
      $state.go('app.post', {category: "qa"});
    };

    $scope.goToContact = function() {
      $state.go('app.post', {category: "qa"});
    };

    $scope.goToProfile = function() {
      $state.go('app.profile');
    };
  });
