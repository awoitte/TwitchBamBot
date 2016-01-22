var UserStorageAccess = require('../user-storage-access');

module.exports = function(userStorage, twitch, frontEnd, users) {
    var userStorageAccess = UserStorageAccess(userStorage);

    setInterval(function() {
        getUserFlagList(userStorageAccess, function(err, userObjs) {
            var currentUsers = users.getUserList(),
                usersWithFlags = currentUsers.map(function(username) {
                    return userObjs.find(function(obj) {
                        return obj.key === username;
                    });
                });


            frontEnd.broadcastEvent("usersWithFlags", usersWithFlags);
        })
    }, 1000);

    return {
        getUserFlagList: getUserFlagList.bind(null, userStorageAccess),
        setUserFlag: setUserFlag.bind(null, userStorageAccess, twitch)
    };
};

function getUserFlagList(userStorage, callback) {
    userStorage.getUserView("users/byFlags", callback);
}

function setUserFlag(userStorage, twitch, command, parameters, user, message) {
    if (parameters.length === 0) return twitch.say("Please include a country code");

    userStorage.getUser(user, function(err, userObj) {
        userObj.flag = parameters;
        userStorage.updateUserObj(user, userObj);
    });
}