var request = require('request');

module.exports = function(twitch, checkFrequency) {

    var options = {
        users: [],
        userInChatCallbacks: []
    };

    // twitch.onjoin(recordAUser.bind(null));

    // twitch.onpart(discardAUser.bind(null));


    fetchUserList(options, handleChatInfoResponse.bind(null, options));
    setInterval(fetchUserList.bind(null,
        options,
        handleChatInfoResponse.bind(null, options)), checkFrequency);

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
        options.users.push(user);
        options.userInChatCallbacks.forEach(function(callback) {
            callback(user);
        });
    }
}
