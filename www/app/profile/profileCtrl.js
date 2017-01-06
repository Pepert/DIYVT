angular.module('diyvt.profileCtrl', [])

  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('app.profile', {
        url: '/profile',
        views: {
          'menuContent': {
            templateUrl: 'app/profile/profile.html',
            controller: 'ProfileCtrl'
          }
        }
      });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/profile');
  })

  .controller('ProfileCtrl', function($scope, $http, $ionicPopup) {

    $scope.loginData = {};
    var userId = 2;

    $scope.changePass = function () {
      $ionicPopup.show({
        template: '<input type="password" ng-model="data.password">',
        title: 'Change my password',
        subTitle: 'Please enter the current password you want to change',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Ok</b>',
            type: 'button-positive',
            onTap: function(e) {
              if (!$scope.data.password) {
                e.preventDefault();
              } else {
                var linkVerif = 'http://diyvt.leonard-peronnet.com/users/' + userId;

                $http.post(linkVerif, {password: $scope.data.password}).then(function (res){
                  if(res.data) {
                    $ionicPopup.show({
                      template: '<input type="password" ng-model="data.password">',
                      title: 'Change my password',
                      subTitle: 'Please enter the new password you want to use',
                      scope: $scope,
                      buttons: [
                        { text: 'Cancel' },
                        {
                          text: '<b>Ok</b>',
                          type: 'button-positive',
                          onTap: function(e) {
                            if (!$scope.data.password) {
                              e.preventDefault();
                            } else {
                              var link = 'http://diyvt.leonard-peronnet.com/users/3';

                              var password = $scope.data.password;

                              var updatedUser = {
                                password: password
                              };

                              $http.put(link, updatedUser).then(function (res){
                                console.log('profil mis à jour');
                              });
                            }
                          }
                        }
                      ]
                    });
                  }
                  else {
                    console.log('Le mot de passe ne correspond pas');
                  }
                });
              }
            }
          }
        ]
      });
    };

    $scope.updateProfile = function(){
      var link = 'http://diyvt.leonard-peronnet.com/users/3';

      var firstname = $scope.loginData.firstname;
      var lastname = $scope.loginData.lastname;
      var screenName = $scope.loginData.screenname;

      var updatedUser = {
        firstname: firstname,
        lastname: lastname,
        screenName: screenName
      };

      $http.put(link, updatedUser).then(function (res){
        console.log('profil mis à jour');
      });
    };

  });
