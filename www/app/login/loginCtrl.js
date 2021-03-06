angular.module('diyvt.loginCtrl', ['diyvt.getuser'])

  .config(function($stateProvider, $urlRouterProvider) {

    $stateProvider

      .state('app.login', {
        cache: false,
        url: '/login',
        views: {
          'menuContent': {
            templateUrl: 'app/login/login.html',
            controller: 'LoginCtrl'
          }
        }
      });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/login');
  })

  .controller('LoginCtrl', function(
    $scope,
    $http,
    $state,
    GetUser,
    $q,
    UserService,
    $ionicLoading,
    $ionicPopup,
    $ionicPlatform
  ) {
    $scope.data = {};
    $scope.connected = false;
    if(window.localStorage.getItem('user') !== null) {
      $scope.connected = true;
    }

    //This method is executed when the user press the "Login with facebook" button
    $scope.facebookSignIn = function() {
      facebookConnectPlugin.getLoginStatus(function(success){
        if(success.status === 'connected'){
          // The user is logged in and has authenticated your app, and response.authResponse supplies
          // the user's ID, a valid access token, a signed request, and the time the access token
          // and signed request each expire

          // Check if we have our user saved
          var user = UserService.getUser('facebook');

          if(!user.userID){
            getFacebookProfileInfo(success.authResponse)
              .then(function(profileInfo) {
                UserService.setUser({
                  authResponse: success.authResponse,
                  userID: profileInfo.id,
                  name: profileInfo.name,
                  email: profileInfo.email,
                  picture : "http://graph.facebook.com/" + success.authResponse.userID + "/picture?type=large"
                });

                $http.get(link).then(function (res){
                  var userId = GetUser.getUserId(user.email, res);
                  window.localStorage.setItem('user', userId);
                  $state.go('app.home');
                });
              }, function(fail){
                // Fail get profile info
              });
          }else{
            var link = 'http://diyvt.leonard-peronnet.com/users';

            $http.get(link).then(function (res){
              var userId = GetUser.getUserId(user.email, res);
              window.localStorage.setItem('user', userId);
              $state.go('app.home');
            });
          }
        } else {
          // If (success.status === 'not_authorized') the user is logged in to Facebook,
          // but has not authenticated your app
          // Else the person is not logged into Facebook,
          // so we're not sure if they are logged into this app or not.

          /*
          $ionicLoading.show({
            template: 'Logging in...'
          });
          */

          // Ask the permissions you need. You can learn more about
          // FB permissions here: https://developers.facebook.com/docs/facebook-login/permissions/v2.4
          facebookConnectPlugin.login(['email', 'public_profile'], fbLoginSuccess, fbLoginError);
        }
      }, true);
    };

    //Facebook native connection part
    var fbLoginSuccess = function(response) {
      if (!response.authResponse){
        fbLoginError("Cannot find the authResponse");
        return;
      }

      var authResponse = response.authResponse;

      getFacebookProfileInfo(authResponse)
        .then(function(profileInfo) {
          UserService.setUser({
            authResponse: authResponse,
            userID: profileInfo.id,
            name: profileInfo.name,
            email: profileInfo.email,
            picture : "http://graph.facebook.com/" + authResponse.userID + "/picture?type=large"
          });

          var email = profileInfo.email;
          var id = profileInfo.id;
          var name = profileInfo.name;
          var link = 'http://diyvt.leonard-peronnet.com/users';

          $http.get(link).then(function (res){

            var userId = GetUser.getUserId(email, res);
            if(userId > 0) {
              window.localStorage.setItem('user', userId);
              $ionicLoading.hide();
              $state.go('app.home');
            }
            else {
              var $newUser = {
                firstname: name,
                lastname: "",
                email: email,
                password: id,
                screenName: "Anonymous"
              };

              $http.post(link, $newUser).then(function (res){
                window.localStorage.setItem('user', res.data.id);
                $ionicLoading.hide();
                $state.go('app.home');
              });
            }

          });
        }, function(fail){
        });
    };

    var fbLoginError = function(error){
      $ionicLoading.hide();
    };

    // This method is to get the user profile info from the facebook api
    var getFacebookProfileInfo = function (authResponse) {
      var info = $q.defer();

      facebookConnectPlugin.api('/me?fields=email,name&access_token=' + authResponse.accessToken, null,
        function (response) {
          info.resolve(response);
        },
        function (response) {
          info.reject(response);
        }
      );
      return info.promise;
    };



    //$scope.user = UserService.getUser();

    $scope.showLogOutMenu = function() {
      $ionicPopup.show({
        template: 'Are you sure you want to log out ?',
        title: 'Log out',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: 'Yes',
            type: 'button-positive',
            onTap: function(e) {
              $ionicLoading.show({
                template: 'Logging out...'
              });

              window.localStorage.clear();
              $ionicPlatform.registerBackButtonAction(function (event) {
                event.preventDefault();
              }, 100);
              $state.reload();

              // Facebook logout
              facebookConnectPlugin.logout(function(){
                $ionicLoading.hide();
              },
              function(fail){
                $ionicLoading.hide();
              });

              //Google logout
              window.plugins.googleplus.logout(
                function (msg) {
                  $ionicLoading.hide();
                },
                function(fail){
                  $ionicLoading.hide();
                }
              );
            }
          }
        ]
      });
    };

    //Google native connection part
    $scope.googleSignIn = function() {
      $ionicLoading.show({
        template: 'Logging in...'
      });

      window.plugins.googleplus.login(
        {},
        function (user_data) {

          var email = user_data.email;
          var id = user_data.userId;
          var name = user_data.displayName;
          var link = 'http://diyvt.leonard-peronnet.com/users';

          $http.get(link).then(function (res){

            var userId = GetUser.getUserId(email, res);

            if(userId > 0) {
              window.localStorage.setItem('user', userId);
              $ionicLoading.hide();
              $state.go('app.home');
            }
            else {
              var $newUser = {
                firstname: "",
                lastname: "",
                email: email,
                password: id,
                screenName: name
              };

              $http.post(link, $newUser).then(function (res){
                window.localStorage.setItem('user', res.data.id);
                $ionicLoading.hide();
                $state.go('app.home');
              });
            }
          })
        },
        function (msg) {
          $ionicLoading.hide();
        }
      );
    };












    $scope.loginData = {};

    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
      var email = $scope.loginData.email;
      var password = $scope.loginData.password;
      var link = 'http://diyvt.leonard-peronnet.com/users';

      $http.get(link).then(function (res){
        var userId = GetUser.getUserId(email, res);

        if(userId > 0) {
          var linkVerif = 'http://diyvt.leonard-peronnet.com/users/' + userId;

          $http.post(linkVerif, {password: password}).then(function (res){
            if(res.data) {
              window.localStorage.setItem('user', userId);
              $state.go('app.home');
            }
            else {
              $ionicPopup.alert({
                title: 'Wrong password',
                template: 'Password doesn\'t correspond to this email'
              });
            }
          });
        }
        else {
          $ionicPopup.alert({
            title: 'No corresponding user',
            template: 'Your login entries are not valid'
          });
        }

      });
    };

    $scope.goToCreate = function() {
      $state.go('app.newaccount');
    };

    $scope.getNewPass = function() {
      var alertPopup;

      $ionicPopup.show({
        template: '<input type="email" ng-model="data.email">',
        title: 'Password forgotten',
        subTitle: 'Please enter the e-mail address connected to your account',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Ok</b>',
            type: 'button-positive',
            onTap: function(e) {
              if (!$scope.data.email) {
                e.preventDefault();
              } else {
                var link = 'http://diyvt.leonard-peronnet.com/users';

                $http.get(link).then(function (res){

                  var userId = GetUser.getUserId($scope.data.email, res);

                  if(userId > 0) {
                    var linkNewPass = 'http://diyvt.leonard-peronnet.com/users/newpass/' + (userId);

                    $http.get(linkNewPass).then(function (res){
                      if(res.data) {
                        $ionicPopup.alert({
                          title: 'New password sent',
                          template: 'You can now connect with the password that has been sent on your e-mail address.' +
                          ' You can change this password through your profile page'
                        });
                      }
                      else {
                        $ionicPopup.alert({
                          title: 'Error',
                          template: 'A problem has occured, please try again.'
                        });
                        $state.go('app.login');
                      }
                    });
                  }
                  else {
                    $ionicPopup.alert({
                      title: 'Unknown user',
                      template: 'There is no user identified by this e-mail address. You can use it to create a new account.'
                    });
                    $state.go('app.newaccount');
                  }

                });
              }
            }
          }
        ]
      });
    };

    $scope.guestLogin = function() {
      window.localStorage.setItem('user', -1);
      $state.go('app.home');
    };

  });
