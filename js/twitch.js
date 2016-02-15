var irc = require("tmi.js"),
    clone = require('clone');

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
        },
        whisperOptions = clone(options);

    whisperOptions.connection.random = "group";

    var client = new irc.client(options),
        whisperClient = new irc.client(whisperOptions);

    // Connect the client to the server..
    client.connect();
    whisperClient.connect();
    return {
        onchat: client.on.bind(client, "chat"),
        onwhisper: whisperClient.on.bind(whisperClient, "whisper"),
        onjoin: client.on.bind(client, "join"),
        onpart: client.on.bind(client, "part"),
        say: client.say.bind(client, config.channel),
        whisper: whisperClient.whisper.bind(whisperClient)
    };
};
