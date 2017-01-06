angular.module('diyvt.createAccountCtrl', [])

  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('app.newaccount', {
        url: '/newaccount',
        views: {
          'menuContent': {
            templateUrl: 'app/createaccount/createAccount.html',
            controller: 'CreateAccountCtrl'
          }
        }
      });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/newaccount');
  })

  .controller('CreateAccountCtrl', function($scope, $http, $ionicPopup) {

    $scope.loginData = {};

    $scope.create = function(){
      var link = 'http://diyvt.leonard-peronnet.com/users';

      var firstname = $scope.loginData.firstname;
      var lastname = $scope.loginData.lastname;
      var screenName = $scope.loginData.screenname;
      var email = $scope.loginData.email;
      var password = $scope.loginData.password;
      var passwordConf = $scope.loginData.passwordconf;

      if(passwordConf != password) {
        $scope.showAlert = function() {
          $ionicPopup.alert({
            title: 'Confirmation incorrect',
            template: 'The confirmation password has to be the same as the previous password entry'
          });
        };
      }
      else {
        if(isEmpty(screenName)) {
          screenName = firstname + " " + lastname;
        }

        var $newUser = {
          firstname: firstname,
          lastname: lastname,
          screenName: screenName,
          email: email,
          password: password,
          imgurl: ""
        };

        $http.post(link, $newUser).then(function (res){
          console.log('nouvel utilisateur enregistré');
        });
      }
    };

  });
