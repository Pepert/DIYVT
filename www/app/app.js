// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in qaCtrl.js
angular.module('diyvt', [
  'ionic',
  'ngCordova',
  'diyvt.getuser',
  'diyvt.userservice',
  'diyvt.mainMenuCtrl',
  'diyvt.managevtCtrl',
  'diyvt.loginCtrl',
  'diyvt.createAccountCtrl',
  'diyvt.postCtrl',
  'diyvt.postFavouriteCtrl',
  'diyvt.singlepostCtrl',
  'diyvt.addPostCtrl',
  'diyvt.profileCtrl',
  'diyvt.contactCtrl',
  'diyvt.qaCtrl',
  'diyvt.filter'
])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'app/menu.html'
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
})

.config(['$httpProvider', function($httpProvider) {
  $httpProvider.defaults.headers.patch = {
    'Content-Type': 'application/json;charset=utf-8'
  };
}]);
