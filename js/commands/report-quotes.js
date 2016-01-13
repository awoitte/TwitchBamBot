module.exports = function (quotes, twitch){
    return {
        reportQuote: reportQuote.bind(null, quotes, twitch),
        addQuote: quotes.addQuote
    };
};

function reportQuote(quotes, twitch, command, parameters, user, message){
	quotes.getQuote(function (quoteObj) {
		twitch.say('"' + quoteObj.value + '" - thatsBamboo');
	});
};