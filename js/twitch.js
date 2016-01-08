var irc = require("tmi.js");

module.exports = function(config) {

    var options = {
        options: {
            debug: true
        },
        connection: {
            random: "chat",
            reconnect: true
        },
        identity: {
            username: config.username,
            password: config.password
        },
        channels: [config.channel]
    };

    var client = new irc.client(options);

    // Connect the client to the server..
    client.connect();
    return {
    	onchat: client.on.bind(client, "chat"),
    	onwhisper: client.on.bind(client, "whisper"),
    	onjoin: client.on.bind(client, "join"),
    	onpart: client.on.bind(client, "part"),
    	say: client.say.bind(client, config.channel)
    };
};