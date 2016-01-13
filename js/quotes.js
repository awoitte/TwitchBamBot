var getRandom = require('./get-random-thing');

module.exports = function (storage){
    return {
        addQuote: addQuote.bind(null, storage),
        getQuote: getQuote.bind(null, storage)
    };
};

function addQuote (storage, command, parameters, user, message) {
	console.log("ADDING");
	saveQuote(storage, makeQuote(user, parameters))
}

function makeQuote (user, quote) {
	return {
		user: user,
		quote: quote,
		isQuote: true
	};
}

function getAllQuotes (storage, callback) {
	storage.getThingsInView("quotes/all", function (err, quotes) {
		if(err) console.log("error getting quotes: " + err);
		callback(quotes)
	})
}

function saveQuote (storage, quote) {
	getAllQuotes(storage, function (quotes) {
		storage.saveAThing(quotes.length.toString(), quote);
	});
}

function getQuote (storage, callback) {
	getAllQuotes(storage, function (quotes) {
		console.log(quotes)
		callback(getRandom(quotes));
	});
}