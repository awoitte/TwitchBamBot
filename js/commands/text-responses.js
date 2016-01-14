var textResponses = require('./text-responses.json'),
	Mustache = require('mustache');

module.exports = function (twitch){
	return {
		isTextCommand: isTextCommand,
		doTextCommand: doTextCommand.bind(null, twitch),
		listTextCommands: listTextCommands.bind(null)
	}
};

function isTextCommand (command) {
	return !!textResponses[command];
}

function doTextCommand (twitch, command, parameters, user, message) {
	var output = Mustache.render(textResponses[command], {
		command: command,
		parameters: parameters,
		user: user,
		message: message
	});
	twitch.say(output);
}

function listTextCommands() {
	var commands = [];
	for(var command in textResponses){
		commands.push(command);
	}
	return commands;
}