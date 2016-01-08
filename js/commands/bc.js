var benedicts = require('./benedicts.json'),
	cumberbunches = require('./cumberbunches.json');

module.exports = function (twitch){
	var benedictId = Math.round(Math.random() * benedicts.length),
		benedict = benedicts[benedictId],
		cumberbunchesId = Math.round(Math.random() * cumberbunches.length),
		cumberbunch = cumberbunches[cumberbunchesId];

		twitch.say(benedict + " " + cumberbunch + "!");
};