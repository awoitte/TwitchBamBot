var fs = require('fs'),
	bypassList = [
		'thatsbamboo',
		'mylittlebrohoho'
	];

module.exports = function(frontEnd, costAmmount, cost, userPoints, twitch) {
	var options = {
		soundFiles: []
	};

    fs.readdir('C:/TwitchBot/public/SFX', function(err, data) {
        if (err) console.log("error:" + err);
        options.soundFiles = filterSoundFiles(data);
    });
    return {
        playSound: playSound.bind(null, options, frontEnd, costAmmount, cost, userPoints, twitch)
    }
}

function playSound(options, frontEnd, costAmmount, cost, userPoints, twitch, command, parameters, user, message) {
	if(parameters === "") return twitch.say(options.soundFiles.join(", "));

	if(options.soundFiles.indexOf(parameters) === -1) return twitch.say("invalid file name, choose from: " + options.soundFiles.join(", "));

	if(bypassList.indexOf(user) !== -1) return frontEnd.broadcastEvent("sfx", "SFX/" + parameters + ".mp3");

	cost( userPoints, costAmmount, twitch, function () {
		frontEnd.broadcastEvent("sfx", "SFX/" + parameters + ".mp3");
	}, command, parameters, user, message);
};

function filterSoundFiles (files) {
	return files.filter(function (file) {
		return file.indexOf(".mp3") !== -1;
	}).map(function (file) {
		return file.replace(".mp3", "");
	});
}