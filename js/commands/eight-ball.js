var responses = require('./eight-ball.json'),
	getRandom = require('../get-random-thing');

module.exports = function (twitch){
	var response = getRandom(responses);
		twitch.say(response);
};