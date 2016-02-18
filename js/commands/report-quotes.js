module.exports = function(quotes, twitch) {
    return {
        reportQuote: reportQuote.bind(null, quotes, twitch),
        addQuote: quotes.addQuote
    };
};

function reportQuote(quotes, twitch, command, parameters, user, message) {
    if (parameters === "") return quotes.getQuote(sayQuote.bind(null, twitch));

    var index = parseInt(parameters);
    if (index <= 0) return twitch.say("Kappa");

    if (isNaN(index)) twitch.say('please include a quote index number');
    else quotes.getAllQuotes(function(quotes) {
        if (index > quotes.length) twitch.say("There are only " + quotes.length + " quotes");
        else sayQuote(twitch, getQuoteAtIndex(quotes, index - 1));
    });

};

function sayQuote(twitch, quoteObj) {
	if(!quoteObj) twitch.say("Error, can't find that quote D:" );
    twitch.say('"' + quoteObj.value + '" - thatsBamboo');
}

function getQuoteAtIndex(quotes, index) {
    return quotes.find(function(quoteObj) {
        return quoteObj.id == index;
    })
}
