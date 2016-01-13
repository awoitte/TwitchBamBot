module.exports = function (things){
	var thingId = Math.floor(Math.random() * things.length);

    return things[thingId < 0 ? 0 : thingId];
};