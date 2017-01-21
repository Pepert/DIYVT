angular.module('diyvt.managevtCtrl', [])

  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('app.managevt', {
        url: '/managevt',
        views: {
          'menuContent': {
            templateUrl: 'app/managevt/managevt.html',
            controller: 'ManagevtCtrl'
          }
        }
      });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/managevt');
  })

  .controller('ManagevtCtrl', function($scope, $state, $ionicModal, $timeout) {
    $scope.goToVtExercises = function() {
      $state.go('app.post', {category: "VT exercises"});
    };

    $scope.goToVtTools = function() {
      $state.go('app.post', {category: "VT tools"});
    };

    $scope.goToOptics = function() {
      $state.go('app.post', {category: "Optics"});
    };

    $scope.goToConditions = function() {
      $state.go('app.post', {category: "Conditions & symptoms"});
    };

    $scope.goToSurgery = function() {
      $state.go('app.post', {category: "VT or eye surgery"});
    };

    $scope.goToTips = function() {
      $state.go('app.post', {category: "Tips to foster VT"});
    };
  });
