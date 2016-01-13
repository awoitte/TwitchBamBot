module.exports = function(userStorage) {
    return {
        awardUserPoint: awardUserPoint.bind(null, userStorage),
        modifyUserPoints: modifyUserPoints.bind(null, userStorage),
        getUserPoints: getUserPoints.bind(null, userStorage)
    };
};

function getUser(storage, user, callback) {
    storage.getAThing(user, function(err, userObj) {
        if (err && !err.headers.status === 404) {
            if (callback) callback(err);
            return;
        }

        if (!userObj) userObj = makeUserObj(user);
        if (callback) callback(false, userObj);
    })
}

function awardUserPoint(storage, user, callback) {
    getUser(storage, user, function(err, userObj) {
        var updatedUser = addPoints(userObj);
        updateUserObj(storage, user, updatedUser);
        if (callback) callback(false, updateUserObj);
    });
}

function addPoints(userObj, quantity) {
    if (!userObj.points) userObj.points = 0;
    userObj.points += quantity || 1;
    return userObj;
}

function makeUserObj(user) {
    return {
        name: user,
        points: 0
    }
}

function updateUserObj(storage, user, userObj) {
    storage.saveAThing(user, userObj);
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

    getUser(userStorage, username, function(err, userObj) {
        if(err && callback) callback(err);
        var updatedUser = addPoints(userObj, quantityOfPoints);
        updateUserObj(userStorage, username, updatedUser);
        if (callback) callback(false, updatedUser);
    });
}
