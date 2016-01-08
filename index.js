var config = require('./config/config.json'),
    twitch = require('./js/twitch')(config),
    storage = require('./js/storage')(config.storage),
    users = require('./js/users')(twitch, storage),
    parseMessage = require('./js/parse-message'),
    workingOn = require('./js/commands/workingon')(twitch, 'a twitch bot! Say "Hi!"'),
    cost = require('./js/commands/cost'),
    joke = require('./js/commands/joke'),
    eightBall = require('./js/commands/eight-ball'),
    bc = require('./js/commands/bc');

var AdminCommands = {
        "setworkingon": workingOn.setWorkingOn
    },
    customCommands = {
        "workingon": workingOn.sayWorkingOn,
        "coffee": cost.bind(null, twitch, 2.38, "coffees"),
        "redbull": cost.bind(null, twitch, 2.19, "redbulls"),
        "cappuccino": cost.bind(null, twitch, 3.45, "cappuccinos"),
        "coffeegulps": cost.bind(null, twitch, 0.10, "gulps of coffee"),
        "cappuccinogulps": cost.bind(null, twitch, 0.14, "gulps of cappuccino"),
        "joke": joke.bind(null,twitch),
        "jokes": joke.bind(null,twitch),
        "8ball": eightBall.bind(null,twitch),
        "eightball": eightBall.bind(null,twitch),
        "bc": bc.bind(null, twitch),
        "benedictcumberbatch": bc.bind(null, twitch),
        "benedict": bc.bind(null, twitch)

    },
    textResponses = require('./js/commands/text-responses')(twitch);

twitch.onchat(function(channel, userInfo, message, self) {
    executeCommands(userInfo.username, message);
});

twitch.onwhisper(function(username, message) {
    console.log("whisper: " + username + " " + message);
    executeCommands(username, message);
});

function executeCommands(user, message) {

    var parsed = parseMessage(message);

    if (user === config.username) return;
    else if (user === config.admin) executeAdminCommands(parsed.command, parsed.parameters, user, message);
    else executeUserCommands(parsed.command, parsed.parameters, user, message);
}

function executeUserCommands(command, parameters, user, message) {
    if (textResponses.isTextCommand(command)) textResponses.doTextCommand(command);
    if (customCommands[command]) customCommands[command](command, parameters, user, message);
}

function executeAdminCommands(command, parameters, user, message) {
    if (AdminCommands[command]) AdminCommands[command](command, parameters, user, message);
    else executeUserCommands(command, parameters, user, message);
}

//Features:
//refactor commands
//Loop through users!!!!
//In chat users display (mod whack-a-mole)
//command list (per-user availability)
//user levels (db?)
//push messages through wrapper and check for chat delay
//dynamic add commands (and save to file/db)
//spam protection?
//polls : https://github.com/strawpoll/strawpoll/wiki/API
//SFX
//Point cost on commands
//quote system
//templates for text responses
//betting?
//magic 8 ball
//raid system (post link and host)
//twitch alerts integration : https://twitchalerts.readme.io/
