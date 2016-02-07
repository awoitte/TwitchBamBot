var request = require('request');

//

module.exports = function(twitch) {
    return {
        doPoll: doPoll.bind(null, twitch)
    };
};

function doPoll(twitch, command, parameters, user, message) {

    var title = getTitle(parameters),
        options = getOptions(parameters);

    if(!title || !options) return twitch.say("invalid input!!! D:");

    postPoll(title, options, false, function(data, err) {
        if (err) return twitch.say("strawpoll responded with: " + err);

        twitch.say("YOU HAVE 5 MINUTES TO VOTE: http://strawpoll.me/" + data.id);

        setTimeout(getPoll.bind(null, data.id, function (data, err) {
            if(err)return twitch.say("error getting poll data D:");

            reportPoll(twitch, JSON.parse(data));
        }), (5 * 60 * 1000));
    });

}

function reportPoll (twitch, data) {
    console.log(data);
    if(!data || !data.options || !data.votes) return twitch.say("Error parsing poll data D:");

    var finalVotes = data.options.map(function function_name (optionName, i) {
        return optionName + ": " + data.votes[i];
    });

    twitch.say("FINAL VOTES:" + finalVotes.join(", "));
}

function postPoll(title, options, multi, callback) {
    //TODO: DEFINITELY refactor post requests
    request.post('https://strawpoll.me/api/v2/polls', {
            form: {
                "title": title,
                "options": options,
                "multi": !!multi
            }
        })
        .on('response', function(response) {
            console.log("poll status code: " + response.statusCode);
            if (response.statusCode >= 200 && response.statusCode < 300) {
                response.on('data', function(data) {
                    var pollData = JSON.parse(data.toString('utf8'));
                    callback(pollData);
                });
            } else {
                callback(void 0, response.statusCode);
            }
        });
}

function getPoll(id, callback) {
    //TODO: refactor requests
    request('https://strawpoll.me/api/v2/polls/' + id,
        function(error, response, body) {
            if (!error && response.statusCode == 200) {
                callback(body);
            } else {
                callback(void 0, response.statusCode);
                console.log("get poll error:" + error);
                if (response && response.statusCode != 200) console.log("with response code: " + response.statusCode);
            }
        });
}

function getTitle (parameters) {
    var spaceIndex = parameters.indexOf(" ");
    if(spaceIndex === -1) return void 0;
    else return parameters.substr(0, spaceIndex);
}

function getOptions (parameters) {
    var spaceIndex = parameters.indexOf(" ");
    if(spaceIndex === -1) return void 0;

    var optionsString = parameters.substr(spaceIndex);
    return optionsString.split(",");
}