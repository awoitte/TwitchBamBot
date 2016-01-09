module.exports = function (userPoints, twitch, command, parameters, user, message){
    userPoints.getUserPoints(user, function (err, points) {
    	if(err) twitch.say("Error :(");
    	else twitch.say(user + " has " + points + " points!");
    })
};