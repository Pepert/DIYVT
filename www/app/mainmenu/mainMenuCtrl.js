angular.module('diyvt.mainMenuCtrl', [])

  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('app.home', {
        cache: false,
        url: '/home',
        views: {
          'menuContent': {
            templateUrl: 'app/mainmenu/mainMenu.html',
            controller: 'MainMenuCtrl'
          }
        }
      });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/home');
  })

  .controller('MainMenuCtrl', function($scope, $state) {
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
