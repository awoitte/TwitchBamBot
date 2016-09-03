var fs = require('fs'),
	getRandom = require('../get-random-thing'),
	bypassList = [
		'thatsbamboo',
		'mylittlebrohoho',
		'qeraix',
		'rosematoes',
		'lost_thing'
	];

module.exports = function(frontEnd, costAmmount, cost, userPoints, twitch) {
	var options = {
		soundFiles: [],
		enabled: true,
        cooldown: false
	};

    fs.readdir('./public/SFX', function(err, data) {
        if (err) console.log("error:" + err);
        options.soundFiles = filterSoundFiles(data);
    });
    return {
        playSound: playSound.bind(null, options, frontEnd, costAmmount, cost, userPoints, twitch),
        toggleSounds: toggleSounds.bind(null, options)
    }
}

function playSound(options, frontEnd, costAmmount, cost, userPoints, twitch, command, parameters, user, message) {
    if (!options.enabled) return twitch.say("sound effects are currently disabled");

	if(parameters === "") return twitch.whisper(user, options.soundFiles.join(", "));

	if (options.cooldown) return twitch.say("sound effects are on cooldown");
	
	var soundName = parameters === "random" ? getRandom(options.soundFiles) : parameters.toLowerCase();

	if(options.soundFiles.indexOf(soundName) === -1) return twitch.whisper(user, "invalid file name, choose from: " + options.soundFiles.join(", "));

	if(bypassList.indexOf(user) !== -1) return frontEnd.broadcastEvent("sfx", "SFX/" + soundName + ".mp3");

	cost(userPoints, costAmmount, twitch, function () {

	    options.cooldown = true;
	    setTimeout(function () {
	        options.cooldown = false;
	    }, 30 * 1000);

		frontEnd.broadcastEvent("sfx", "SFX/" + soundName + ".mp3");
	}, command, soundName, user, message);
};

function filterSoundFiles (files) {
	return files.filter(function (file) {
		return file.indexOf(".mp3") !== -1;
	}).map(function (file) {
		return file.replace(".mp3", "");
	});
}

function toggleSounds (options) {
	options.enabled = !options.enabled;
}