var jokes = require('./jokes.json');

module.exports = function (twitch){
	var jokeId = Math.round(Math.random() * jokes.length),
		joke = jokes[jokeId];

		twitch.say(joke.partOne + " ... " + joke.partTwo + "\n - http://theoatmeal.com/djtaf/" );

};