var irc = require("tmi.js"),
    config = require('./config.json'),
    textResponses = require('./text-responses.json'),
    punctuationRE = /([.!])/g,
    currentStatus = {
        workingOn: 'a twitch bot! Say "Hi!"'
    };


var AdminCommands = {
        "what": updateCurrentlyWorkingOn,
        "testadmin": testAdmin
    },
    customCommands = {
        "what": respondWithCurrentlyWorkingOn
    };

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

client.on("chat", function(channel, userInfo, message, self) {
    executeCommands(userInfo.username, message);
});

client.on("whisper", function(username, message) {
    console.log("whisper: " + username + " " + message);
    executeCommands(username, message);
});

client.on("join", function(channel, username) {
    console.log("JOIN: " + username);
});

client.on("part", function(channel, username) {
    console.log("PART: " + username);
});

// Connect the client to the server..
client.connect();

function executeCommands(user, message) {

    var first = message.split(" ")[0],
        command = first.toLowerCase().replace(punctuationRE, ""),
        parameters = "",
        parametersLocation = message.indexOf(" ");

    if (parametersLocation !== -1) parameters = message.slice(parametersLocation);

    if (user === config.username) return;
    else if (user === config.admin) executeAdminCommands(command, user, message, parameters);
    else executeUserCommands(command, user, message, parameters);
}

function executeUserCommands(command, user, message, parameters) {
    if (textResponses[command]) client.say(config.channel, textResponses[command]);
    if (customCommands[command]) customCommands[command](command, user, message, parameters);
}

function executeAdminCommands(command, user, message, parameters) {
    if (AdminCommands[command]) AdminCommands[command](command, user, message, parameters);
    else executeUserCommands(command, user, message, parameters);
}

function updateCurrentlyWorkingOn(command, user, message, parameters) {
    currentStatus.workingOn = parameters;
    client.whisper(config.admin, "currently working on updated to: " + currentStatus.workingOn);
}

function respondWithCurrentlyWorkingOn(command, user, message, parameters) {
    if (parameters === "")
        client.say(config.channel, "I'm currently working on: " + currentStatus.workingOn);
}

function testAdmin() {
    console.log("ADMIN TEST");
    client.raw("CAP REQ :twitch.tv/tags");
}

//Requests
//command list (per-user availability)
//user levels
//jokes : http://theoatmeal.com/djtaf/