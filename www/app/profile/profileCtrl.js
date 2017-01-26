angular.module('diyvt.profileCtrl', [])

  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('app.profile', {
        url: '/profile',
        cache: false,
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

  .controller('ProfileCtrl', function($state, $scope, $http, $ionicPopup) {

    $scope.loginData = {};
    $scope.data = {};
    var userId = window.localStorage.getItem('user');

    if(userId == null || userId == -1) {
      $state.go('app.login');
    } else {
      var getUserLink = 'http://diyvt.leonard-peronnet.com/users/' + userId;
      $http.get(getUserLink).then(function(res) {
        var user = res.data;
        $scope.loginData.firstname = user.firstname;
        $scope.loginData.lastname = user.lastname;
        $scope.loginData.screenName = user.screenName;
      });
    }


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
                              var link = 'http://diyvt.leonard-peronnet.com/users/pass/' + userId;

                              var password = $scope.data.password;

                              var updatedUser = {
                                password: password
                              };

                              $http.post(link, updatedUser).then(function (res){
                                $ionicPopup.alert({
                                  title: 'Password updated',
                                  template: 'Your password is updated'
                                });
                              });
                            }
                          }
                        }
                      ]
                    });
                  }
                  else {
                    $ionicPopup.alert({
                      title: 'Wrong password',
                      template: 'The password you entered is not correct'
                    });
                  }
                });
              }
            }
          }
        ]
      });
    };

    $scope.updateProfile = function(){
      var link = 'http://diyvt.leonard-peronnet.com/users/' + userId;

      var firstname = $scope.loginData.firstname;
      var lastname = $scope.loginData.lastname;
      var screenName = $scope.loginData.screenName;

      if(firstname == null) {
        firstname = "";
      }

      if(lastname == null) {
        lastname = "";
      }

      if(screenName == null) {
        screenName = "";
      }

      var updatedUser = {
        firstname: firstname,
        lastname: lastname,
        screenName: screenName
      };

      $http.put(link, updatedUser).then(function (res){
        $ionicPopup.show({
          template: 'Your profile is updated',
          title: 'Profile updated',
          scope: $scope,
          buttons: [
            {
              text: '<b>Ok</b>',
              type: 'button-positive',
              onTap: function(e) {
                $state.go('app.home');
              }
            }
          ]
        });
      });
    };

  });
