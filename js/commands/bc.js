var benedicts = require('./benedicts.json'),
	cumberbunches = require('./cumberbunches.json'),
	getRandom = require('../get-random-thing');

module.exports = function (twitch){
	var benedict = getRandom(benedicts),
		cumberbunch = getRandom(cumberbunches);

		twitch.say(benedict + " " + cumberbunch + "!");
};