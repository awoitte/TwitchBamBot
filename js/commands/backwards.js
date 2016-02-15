module.exports = function(twitch, command, parameters) {
    if (typeof parameters !== "string") throw "Must provide a string";

    var words = parameters.split(' '),
    reversed = words.map(function reverse(word) {
    	return word.split('').reverse().join('');
    });
    twitch.say(reversed.join(' '));
};
