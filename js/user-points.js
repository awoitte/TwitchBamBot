var UserStorageAccess = require('./user-storage-access');

module.exports = function(userStorage) {
    var userStorageAccess = UserStorageAccess(userStorage);

    return {
        awardUserPoint: awardUserPoint.bind(null, userStorageAccess),
        modifyUserPoints: modifyUserPoints.bind(null, userStorageAccess),
        getUserPoints: getUserPoints.bind(null, userStorage)
    };
};



function awardUserPoint(storage, user, callback) {
    storage.getUser(user, function(err, userObj) {
        var updatedUser = addPoints(userObj);
        storage.updateUserObj(user, updatedUser);
        if (callback) callback(false, updatedUser);
    });
}

function addPoints(userObj, quantity) {
    if (!userObj.points) userObj.points = 0;
    userObj.points += quantity || 1;
    return userObj;
}


function getUserPoints(storage, user, callback) {
    storage.getAThing(user, function(err, userObj) {
        callback(err, (userObj && userObj.points) || 0);
    })
}

function modifyUserPoints(userStorage, callback, command, parameters, adminUser, message) {
    console.log("I AM BEING CALLED");
    var params = parameters.split(" ");
    if (params.length < 2) return callback("correct usage adjustPoints [user] [points]")

    var quantityOfPoints = parseInt(params[1]),
        username = params[0];

    if (isNaN(quantityOfPoints)) return callback("invalid points quantity");

    userStorage.getUser(username, function(err, userObj) {
        if (err && callback) callback(err);
        var updatedUser = addPoints(userObj, quantityOfPoints);
        userStorage.updateUserObj(username, updatedUser);
        if (callback) callback(false, updatedUser);
    });
}
