var textResponses = require('./text-responses.json');

module.exports = function (twitch, defaultText){
	var options = {
		workingOn: defaultText || 'a twitch bot! Say "Hi!"'
	};

	return {
		setWorkingOn: setWorkingOn.bind(null, options),
		sayWorkingOn: sayWorkingOn.bind(null, options, twitch)
	}
};

function setWorkingOn (options, command, nowWorkingOn) {
	options.workingOn = nowWorkingOn;
}

function sayWorkingOn (options, twitch) {
	twitch.say("I am currently working on: " + options.workingOn);
}