module.exports = function (twitch, customCommands, textResponses, command, parameters, user, message){
	var commands = [];
	for(var command in customCommands){
		commands.push(command);
	}

	Array.prototype.push.apply(commands, textResponses.listTextCommands());

	var commandChunks = [];

	for (var i = commands.length - 1; i >= 0; i--) {
		var chunkIndex = Math.floor(i /20);
		if(commandChunks[chunkIndex] == undefined) 
			commandChunks[chunkIndex] = [];

		commandChunks[chunkIndex].push(commands[i]);
	}

	for (var i = 0; i < commandChunks.length; i++) {
		setTimeout(
			whisperChunk.bind(null, twitch, user, commandChunks[i]),
			i * 1000);
	}
};

function whisperChunk(twitch, user, chunk) {
	twitch.whisper(user, "commands: " + chunk.join(", "));
}