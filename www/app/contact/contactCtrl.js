angular.module('diyvt.contactCtrl', [])

  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('app.contact', {
        cache: false,
        url: '/contact',
        views: {
          'menuContent': {
            templateUrl: 'app/contact/contact.html',
            controller: 'ContactCtrl'
          }
        }
      });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/contact');
  })

  .controller('ContactCtrl', function($scope, $state, $http, $ionicPopup) {
    $scope.emailData = {};

    $scope.sendEmail = function() {
      var link = 'http://diyvt.leonard-peronnet.com/email';

      var subject = $scope.emailData.subject;
      var email = $scope.emailData.email;
      var content = $scope.emailData.content;

      var data = {
        subject: subject,
        email: email,
        content: content
      };

      $http.post(link, data).then(function (res){
        $ionicPopup.alert({
          title: 'Message sent',
          template: 'Your message has been sent'
        });
        $state.go('app.home');
      });
    };
  });
