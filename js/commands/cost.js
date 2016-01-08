var money = require('money'),
 currencyRE = /([$])/g;
module.exports = function(twitch, itemCost, itemName, command, parameters) {
    if (typeof parameters !== "string") throw "Must provide a string";

    var cost = parseFloat(parameters.replace(currencyRE, "").split(" ")[0]);

    if (isNaN(cost)) twitch.say("Please provide an amount in dollars");
    else {
        var coffees = Math.floor(cost / itemCost);
        twitch.say("That's " + coffees + " " + itemName + "!");
    }
};
