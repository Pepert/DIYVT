angular.module('diyvt.getuser', [])
  .factory("GetUser", function() {
    var index = 0;
    var userFound = false;

    return {
      getUserId: function(email, res){

        var size = Object.keys(res.data).length;
        console.log(res.data);

        if(size > 0) {
          if(res.data[0].email == email) {
            userFound = true;
            return res.data[index].id;
          }
          else {
            while(res.data[index].email != email && index < (size - 1)) {
              index ++;
              if(res.data[index].email == email) {
                userFound = true;
                return res.data[index].id;
              }
            }
          }
        }

        return -1;
      }
    }
  });
