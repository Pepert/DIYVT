angular.module('diyvt.mainMenuCtrl', [])

  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('app.home', {
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
    $scope.goToFavourite = function() {
      $state.go('app.favouritepost');
    };

    $scope.goToManagevt = function() {
      $state.go('app.managevt');
    };

    $scope.goToPersoStories = function() {
      $state.go('app.post', {category: "personalstories"});
    };

    $scope.goToScientific = function() {
      $state.go('app.post', {category: "scientific"});
    };

    $scope.goToVtbooks = function() {
      $state.go('app.post', {category: "vtbooks"});
    };

    $scope.goToQa = function() {
      $state.go('app.post', {category: "vtbooks"});
    };

    $scope.goToContact = function() {
      $state.go('app.post', {category: "vtbooks"});
    };

    $scope.goToProfile = function() {
      $state.go('app.profile');
    };
  });
