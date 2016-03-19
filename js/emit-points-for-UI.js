var UserStorageAccess = require('./user-storage-access');

module.exports = function(userStorage, users, frontEnd) {
var userStorageAccess = UserStorageAccess(userStorage);

    setInterval(function() {
        getUserPointList(userStorageAccess, function(err, userObjs) {

            if(err) return;
            var currentUsers = users.getUserList(),
                usersWithPoints = currentUsers.map(function(username) {
                    return userObjs.find(function(obj) {
                        return obj.key === username;
                    });
                });


            frontEnd.broadcastEvent("usersWithPoints", usersWithPoints);
        });
    }, 2000);


    return {

    };
};

function getUserPointList(userStorage, callback) {
    userStorage.getUserView("users/byPoints", callback);
}
