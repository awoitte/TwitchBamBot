var request = require('request'),
    loop = require('./variable-time-loop');

module.exports = function(twitch, onlineFrequency, offlineFrequency) {

    var options = {
        users: [],
        userInChatCallbacks: [],
        online: true
    };

    twitch.onjoin(recordAUser.bind(null, options));

    // twitch.onpart(discardAUser.bind(null));


    loop(function() {
        fetchUserList(
            options,
            handleChatInfoResponse.bind(null, options));
        fetchOnlineStatus(options, handleOnlineResponse.bind(null, options));
    }, function() {
        console.log("online: " + options.online);
        return options.online ? onlineFrequency : offlineFrequency;
    });

    return {
        getUserList: getUserList.bind(null, options),
        userPersistsInChat: options.userInChatCallbacks.push.bind(options.userInChatCallbacks)
    };
};

function getUserList(options) {
    return options.users;
}

function fetchUserList(options, callback) {
    if (!options.lastRequest || options.lastRequestFinished === true) {
        options.lastRequestFinished = false;
        options.lastRequest = request('http://tmi.twitch.tv/group/user/thatsbamboo/chatters',
            function(error, response, body) {
                options.lastRequestFinished = true;
                if (!error && response.statusCode == 200) {
                    callback(body);
                } else {
                    console.log("fetch users error:" + error);
                    if(response.statusCode != 200) console.log("with response code: " + response.statusCode);
                }
            })
    }
}


function handleChatInfoResponse(options, body) {
    var chat = JSON.parse(body);
    if (chat && chat.chatters) {
        resetUsers(options);
        for (var group in chat.chatters) {
            chat.chatters[group].forEach(addUser.bind(null, options))
        }
    }

}

function resetUsers(options) {
    options.users = [];
}

function addUser(options, user) {
    if (options.users.indexOf(user) === -1) {
        console.log("adding user " + user);
        options.users.push(user);
        options.userInChatCallbacks.forEach(function(callback) {
            callback(user);
        });
    }
}

function recordAUser(options, channel, username) {
    addUser(options, username);
}

function fetchOnlineStatus(options, callback) {
    if (!options.lastOnlineRequest || options.lastOnlineRequestFinished === true) {
        options.lastOnlineRequestFinished = false;
        options.lastOnlineRequest = request('https://api.twitch.tv/kraken/streams/thatsbamboo',
            function(error, response, body) {
                options.lastOnlineRequestFinished = true;
                if (!error && response.statusCode == 200) {
                    callback(body);
                } else {
                    console.log("fetch online error: " + error);
                    if(response.statusCode != 200) console.log("with response code: " + response.statusCode);
                }
            })
    }
}

function handleOnlineResponse(options, body) {
    var status = JSON.parse(body);
    if (status) {
        options.online = !!status.stream;
    }

}