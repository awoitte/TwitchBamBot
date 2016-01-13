var config = require('./config/config.json'),
    twitch = require('./js/twitch')(config),
    Storage = require('./js/storage'),
    commandCost = require('./js/command-cost'),
    userStorage = Storage(config.storage, 'twitchbot'),
    quoteStorage = Storage(config.storage, 'thatsbambotquotes'),
    users = require('./js/users')(twitch, (3 * 1000 * 60),(10 * 1000 * 60) ),
    userPoints = require('./js/user-points')(userStorage),
    quotes = require('./js/quotes')(quoteStorage),
    reportQuotes = require('./js/commands/report-quotes')(quotes, twitch),
    reportPoints = require('./js/commands/report-points'),
    parseMessage = require('./js/parse-message'),
    workingOn = require('./js/commands/workingon')(twitch, 'a twitch bot! Say "Hi!"'),
    cost = require('./js/commands/cost'),
    joke = require('./js/commands/joke'),
    eightBall = require('./js/commands/eight-ball'),
    bc = require('./js/commands/bc'),
    frontEnd = require('./js/front-end')(__dirname + "\\public");

var AdminCommands = {
        "setworkingon": workingOn.setWorkingOn,
        "adjustpoints": userPoints.modifyUserPoints.bind(null, function (err, userObj) {
            if(err) twitch.say("Error: " + err)
        }),
        "addquote": reportQuotes.addQuote,
        "addqoute": reportQuotes.addQuote,
        "quoteadd": reportQuotes.addQuote,
        "qouteadd": reportQuotes.addQuote,
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
        "benedict": bc.bind(null, twitch),
        "points": reportPoints.bind(null, userPoints, twitch),
        "quote": reportQuotes.reportQuote,
        "qoute": reportQuotes.reportQuote,
        "addquote": commandCost.bind(null, userPoints, 100, twitch, reportQuotes.addQuote),
        "addqoute": commandCost.bind(null, userPoints, 100, twitch, reportQuotes.addQuote),
        "quoteadd": commandCost.bind(null, userPoints, 100, twitch, reportQuotes.addQuote),
        "qouteadd": commandCost.bind(null, userPoints, 100, twitch, reportQuotes.addQuote),
    },
    textResponses = require('./js/commands/text-responses')(twitch);

twitch.onchat(function(channel, userInfo, message, self) {
    executeCommands(userInfo.username, message);
});

twitch.onwhisper(function(username, message) {
    console.log("whisper: " + username + " " + message);
    executeCommands(username, message);
});

users.userPersistsInChat(function (user) {
    userPoints.awardUserPoint(user, function (err) {
        if(err) console.log(err);
    })
})
setInterval(function () {
    frontEnd.broadcastEvent("usersUpdate", users.getUserList());
}, 1000);


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
//In chat users display : https://github.com/geekuillaume/Node.js-Chat/blob/master/server.js
//strawpoii links banned
//get quote by id
//SFX
//command list (per-user availability)
//user levels (db?)
//push messages through wrapper and check for chat delay
//dynamic add commands (and save to file/db)
//spam protection?
//polls : https://github.com/strawpoll/strawpoll/wiki/API
//betting?
//raid system (post link and host)
//twitch alerts integration : https://twitchalerts.readme.io/
// BUY PIZZA WITH POINTS