var config = require('./config/new-config.json'),
    twitch = require('./js/twitch')(config),
    Storage = require('./js/storage'),
    commandCost = require('./js/command-cost'),
    userStorage = Storage(config.storage, 'twitchbot'),
    quoteStorage = Storage(config.storage, 'thatsbambotquotes'),
    users = require('./js/users')(twitch, (3 * 1000 * 60), (10 * 1000 * 60)),
    userPoints = require('./js/user-points')(userStorage),
    quotes = require('./js/quotes')(quoteStorage),
    reportQuotes = require('./js/commands/report-quotes')(quotes, twitch),
    reportPoints = require('./js/commands/report-points'),
    parseMessage = require('./js/parse-message'),
    workingOn = require('./js/commands/workingon')(twitch, 'a twitch bot! Say "Hi!"'),
    cost = require('./js/commands/cost'),
    joke = require('./js/commands/joke'),
    eightBall = require('./js/commands/eight-ball'),
    rps = require('./js/commands/rps'),
    bc = require('./js/commands/bc'),
    frontEnd = require('./js/front-end')(__dirname + "\\public"),
    colour = require('./js/commands/colour')(userStorage, twitch, frontEnd, users),
    flags = require('./js/commands/flag')(userStorage, twitch, frontEnd, users),
    pushPoints = require('./js/emit-points-for-UI')(userStorage, users, frontEnd),
    pushUsers = require('./js/emit-users-for-UI')(users, frontEnd),
    commands = require('./js/commands/commands'),
    sound = require('./js/commands/sound')(frontEnd, 10, commandCost, userPoints, twitch),
    poll = require('./js/poll')(twitch),
    backwards = require('./js/commands/backwards'),
    workout = require('./js/commands/workout')(twitch, users, 30 * 1000 * 60, config);

	
var textResponses = require('./js/commands/text-responses')(twitch),
    AdminCommands = {
        //"setworkingon": workingOn.setWorkingOn,
        "!adjustpoints": userPoints.modifyUserPoints.bind(null, function(err, userObj) {
            if (err) twitch.say("Error: " + err);
        }),
        // "addquote": reportQuotes.addQuote,
        // "addqoute": reportQuotes.addQuote,
        // "quoteadd": reportQuotes.addQuote,
        // "qouteadd": reportQuotes.addQuote,
        "!togglesounds": sound.toggleSounds,
        "!poll": poll.doPoll //eg. poll [title] option a, b,c,d,NEW OPTION
    }, 
    customCommands = {
        //"workingon": workingOn.sayWorkingOn,
        "!coffee": cost.bind(null, twitch, 2.38, "coffees"),
        "!redbull": cost.bind(null, twitch, 2.19, "redbulls"),
        "!cappuccino": cost.bind(null, twitch, 3.45, "cappuccinos"),
        "!coffeegulps": cost.bind(null, twitch, 0.10, "gulps of coffee"),
        "!cappuccinogulps": cost.bind(null, twitch, 0.14, "gulps of cappuccino"),
        "!joke": joke.bind(null, twitch),
        "!jokes": joke.bind(null, twitch),
        "!8ball": eightBall.bind(null, twitch),
        "!9ball": eightBall.bind(null, twitch),
        "!eightball": eightBall.bind(null, twitch),
        "!bc": bc.bind(null, twitch),
        "!benedictcumberbatch": bc.bind(null, twitch),
        "!benedict": bc.bind(null, twitch),
        "!points": reportPoints.bind(null, userPoints, twitch),
        // "quote": reportQuotes.reportQuote,
        // "qoute": reportQuotes.reportQuote,
        // "addquote": commandCost.bind(null, userPoints, 10, twitch, reportQuotes.addQuote),
        // "addqoute": commandCost.bind(null, userPoints, 10, twitch, reportQuotes.addQuote),
        // "quoteadd": commandCost.bind(null, userPoints, 10, twitch, reportQuotes.addQuote),
        // "qouteadd": commandCost.bind(null, userPoints, 10, twitch, reportQuotes.addQuote),
        "!sound": sound.playSound,
        "!sfx": sound.playSound,
        "!soundfx": sound.playSound,
        "!color": colour.setUserColor,
        "!colour": colour.setUserColor,
        "!flag": flags.setUserFlag,
        "!flags": flags.setUserFlag,
        "rock": rps.bind(null, twitch),
        "paper": rps.bind(null, twitch),
        "scissors": rps.bind(null, twitch),
		"!workout": workout.getWorkout.bind(null),
        //"backwards": backwards.bind(null, twitch)
    };

customCommands["!commands"] = commands.bind(null, twitch, customCommands, textResponses);
customCommands["!help"] = customCommands["!commands"];

twitch.onchat(function(channel, userInfo, message, self) {
    executeCommands(userInfo.username, message);
});

twitch.onwhisper(function(username, message) {
    console.log("whisper: " + username + " " + message);
    executeCommands(username, message);
});

users.userPersistsInChat(function(user) {
    userPoints.awardUserPoint(user, function(err) {
        if (err) console.log(err);
    });
});

function executeCommands(user, message) {
    var parsed = parseMessage(message);

    if (user === config.username) return;
    else if (user === config.admin) executeAdminCommands(parsed.command, parsed.parameters, user, message);
    else executeUserCommands(parsed.command, parsed.parameters, user, message);
}

function executeUserCommands(command, parameters, user, message) {
    if (textResponses.isTextCommand(command)) textResponses.doTextCommand(command, parameters, user, message);
    if (customCommands[command]) customCommands[command](command, parameters, user, message);
}

function executeAdminCommands(command, parameters, user, message) {
    if (AdminCommands[command]) AdminCommands[command](command, parameters, user, message);
    else executeUserCommands(command, parameters, user, message);
}

//Features:
//WHISPERS!!!
// Fon Awesome and icons!
//gambeling
//sound cooldown
//strawpoii links banned
//get quote by id
//user levels (db?)
//push messages through wrapper and check for chat delay
//dynamic add commands (and save to file/db)
//spam protection?
//raid system (post link and host)
//twitch alerts integration : https://twitchalerts.readme.io/
// BUY PIZZA WITH POINTS
//uptime
