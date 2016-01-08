var textResponses = require('./text-responses.json');

module.exports = function (twitch){
	return {
		isTextCommand: isTextCommand,
		doTextCommand: doTextCommand.bind(null, twitch)
	}
};

function isTextCommand (command) {
	return !!textResponses[command];
}

function doTextCommand (twitch, command) {
	twitch.say(textResponses[command]);
}