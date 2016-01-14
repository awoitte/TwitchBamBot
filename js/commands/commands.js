module.exports = function (twitch, customCommands, textResponses){
	var commands = [];
	for(var command in customCommands){
		commands.push(command);
	}

	Array.prototype.push.apply(commands, textResponses.listTextCommands());

    twitch.say("commands: " + commands.join(", "));
};