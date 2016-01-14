module.exports = function (userStorage){
    return {
    	updateUserObj: updateUserObj.bind(null, userStorage),
    	getUser: getUser.bind(null, userStorage),
    	getUserView: getUserView.bind(null, userStorage)
    };
};

function updateUserObj(storage, user, userObj) {
    storage.saveAThing(user, userObj);
}

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

function getUserView (userStorage, view, callback) {
	userStorage.getThingsInView(view, function (err, objs) {
		if (err) {
			console.log("Error getting view " + err);
            if (callback) callback(err);
            return;
        }
        if (callback) callback(false, objs);
	})
}

function makeUserObj(user) {
    return {
        name: user,
        points: 0
    }
}