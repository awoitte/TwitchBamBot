module.exports = function(twitch, storage) {

    twitch.onjoin(recordAUser.bind(null, storage));

    twitch.onpart(discardAUser.bind(null, storage));

    return {

    };
};

function recordAUser(storage, channel, username) {
    console.log("JOIN: " + username);
    storage.saveAThing(username, {
        name: username,
        lastJoin: Date.now()
    });
}

function discardAUser(storage, channel, username) {
    console.log("PART: " + username);
    storage.removeAThing(username);
}
