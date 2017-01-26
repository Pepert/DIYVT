angular.module('diyvt.getuser', [])
  .factory("GetUser", function() {
    var userId = -1;

    return {
      getUserId: function(email, res){

        angular.forEach(res.data, function(value, key) {
          if(value.email == email) {
            userId = value.id;
          }
        });

        return userId;
      }
    }
  });
