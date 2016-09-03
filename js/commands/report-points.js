module.exports = function (userPoints, twitch, command, parameters, user, message) {
	var userToGet = parameters === "" ? user : parameters;
    userPoints.getUserPoints(userToGet.toLowerCase(), function (err, points) {
    	if(err) {
    		twitch.whisper("Error :( double check the user name?");
    	}else twitch.whisper(user, userToGet + " has " + points + " points!");
    })
}