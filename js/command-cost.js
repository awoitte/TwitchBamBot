module.exports = function(userPoints, cost, twitch,
    commandFunc, command, parameters, user, message) {
    userPoints.getUserPoints(user, function(err, points) {
        if (err) return twitch.say("Error :" + err);
        if (points < cost) return twitch.say("You don't have enough points to do that");

        //TODO: CLEAN
        userPoints.modifyUserPoints(function(err, userObj) {
            commandFunc(command, parameters, user, message);
        }, command, user + " -" + cost, "thatsBamboo", message)
    })
};
