var jokes = require('./jokes.json')
 getRandom = require('../get-random-thing');

module.exports = function (twitch){
		var joke = getRandom(jokes);
		twitch.say(joke.partOne + " ... " + joke.partTwo + "\n - http://theoatmeal.com/djtaf/" );
};