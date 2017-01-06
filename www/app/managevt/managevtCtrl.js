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
      $state.go('app.post', {category: "vtexercises"});
    };

    $scope.goToVtTools = function() {
      $state.go('app.post', {category: "vttools"});
    };

    $scope.goToOptics = function() {
      $state.go('app.post', {category: "optics"});
    };

    $scope.goToConditions = function() {
      $state.go('app.post', {category: "conditions"});
    };

    $scope.goToSurgery = function() {
      $state.go('app.post', {category: "surgery"});
    };

    $scope.goToTips = function() {
      $state.go('app.post', {category: "tips"});
    };
  });
