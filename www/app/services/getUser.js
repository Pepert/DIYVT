angular.module('diyvt.getuser', [])
  .factory("GetUser", function() {
    var userId = 0;
    var userFound = false;

    return {
      getUserId: function(email, res){

        var size = Object.keys(res.data).length;

        if(res.data[userId].email == email) {
          userFound = true;
          return userId + 1;
        }
        else {
          while(res.data[userId].email != email && userId < (size - 1)) {
            userId ++;
            if(res.data[userId].email == email) {
              userFound = true;
            }
          }
        }

        if(userFound) {
          return userId + 1;
        }
        else {
          return -1;
        }
      }
    }
  });
