var UserStorageAccess = require('../user-storage-access'),
    countries = require('./countries.json');

module.exports = function(userStorage, twitch, frontEnd, users) {
    var userStorageAccess = UserStorageAccess(userStorage);

    setInterval(function() {
        getUserFlagList(userStorageAccess, function(err, userObjs) {
            if(err) return;
            var currentUsers = users.getUserList(),
                usersWithFlags = currentUsers.map(function(username) {
                    return userObjs.find(function(obj) {
                        return obj.key === username;
                    });
                });


            frontEnd.broadcastEvent("usersWithFlags", usersWithFlags);
        });
    }, 2000);

    return {
        getUserFlagList: getUserFlagList.bind(null, userStorageAccess),
        setUserFlag: setUserFlag.bind(null, userStorageAccess, twitch)
    };
};

function getUserFlagList(userStorage, callback) {
    userStorage.getUserView("users/byFlags", callback);
}

function setUserFlag(userStorage, twitch, command, parameters, user, message) {
    if (parameters.length === 0) return twitch.say("Use two letter abreviation or country name: http://www.worldatlas.com/aatlas/ctycodes.htm");

    var abbr = getCountryAbbr(parameters),
        flagName = abbr ? abbr : parameters;

    userStorage.getUser(user, function(err, userObj) {
        if(err) return twitch.say("Error setting flag D:");
        userObj.flag = flagName.toLowerCase();
        userStorage.updateUserObj(user, userObj);
    });
}

function getCountryAbbr (name) {
    var foundCountry = countries.find(function (country) {
        return (country.name.toLowerCase()) === (name.toLowerCase());
    });

    if(foundCountry) return foundCountry.abbr.toLowerCase();
}