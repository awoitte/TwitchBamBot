var UserStorageAccess = require('../user-storage-access');

module.exports = function(userStorage, twitch, frontEnd, users) {
    var userStorageAccess = UserStorageAccess(userStorage);

    setInterval(function() {
        getUserColorList(userStorageAccess, function(err, userObjs) {
            if(err) return;
            var currentUsers = users.getUserList(),
                usersWithColour = currentUsers.map(function(username) {
                    return userObjs.find(function(obj) {
                        return obj.key === username;
                    });
                });


            frontEnd.broadcastEvent("usersWithColours", usersWithColour);
        })
    }, 2000);

    return {
        getUserColorList: getUserColorList.bind(null, userStorageAccess),
        setUserColor: setUserColor.bind(null, userStorageAccess, twitch)
    };
};

function getUserColorList(userStorage, callback) {
    userStorage.getUserView("users/byColours", callback);
}

function setUserColor(userStorage, twitch, command, parameters, user, message) {
    if (parameters.length === 0) return twitch.say("Please include a CSS colour");

    var colour = parameters === "random" ? "#" + randomColor() : parameters;

    userStorage.getUser(user, function(err, userObj) {
        if(err) return twith.say("Error setting colour D:");
        userObj.colour = colour;
        userStorage.updateUserObj(user, userObj);
    });
}

function randomColor() {
    return "000000".replace(/0/g, function() {
        return (~~(Math.random() * 16)).toString(16);
    });
}
