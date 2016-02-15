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
        if (!userObj && err && err.headers && err.headers.status === 404) userObj = makeUserObj(user);
        else if (err) {
            console.log("ERROR GETTING USER: ", err);
            if (callback) callback(err);
            return;
        }

        if (callback) callback(false, userObj);
    });
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