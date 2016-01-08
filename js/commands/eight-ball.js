var responses = require('./eight-ball.json');

module.exports = function (twitch){
	var responseId = Math.round(Math.random() * responses.length),
		response = responses[responseId];

		twitch.say(response);
};