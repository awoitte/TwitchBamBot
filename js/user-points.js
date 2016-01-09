module.exports = function(userStorage) {
    return {
        awardUserPoint: awardUserPoint.bind(null, userStorage),
        getUserPoints: getUserPoints.bind(null, userStorage)
    };
};

function awardUserPoint(storage, user, callback) {
    storage.getAThing(user, function(err, userObj) {
        if (err) {
            if (callback) callback(err);
            return;
        }

        if (!userObj) userObj = makeUserObj(user);
        var updatedUser = addPoint(userObj);
        updateUserObj(storage, user, updatedUser);
        if (callback) callback(false, updatedUser);
    })
}

function addPoint(userObj) {
	if(!userObj.points) userObj.points = 0;
    userObj.points++;
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


function getUserPoints (storage, user, callback) {
    storage.getAThing(user, function(err, userObj) {
        callback(err, (userObj && userObj.points) || 0);
    })
}