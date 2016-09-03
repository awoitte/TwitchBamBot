var loop = require('../variable-time-loop'),
    getRandom = require('../get-random-thing'),
    workouts = require('./workouts.json');

module.exports = function (twitch, users, frequency, config, autoWorkouts) {

	if(autoWorkouts)
    setInterval(function () {
        var workoutText = getWorkout(config.admin);
        if (users.isOnline()) twitch.say(workoutText);
        console.log(users.isOnline() + ":" + workoutText);
    }, frequency);
 
    return {
        getWorkout: getWorkoutCommand.bind(null, twitch, config)
    };
};

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getWorkout(user) {
	var i = getRandomIntInclusive(0, workouts.length - 1);
    var workout = workouts[i];
    var quantity = getRandomIntInclusive(workout.min, workout.max);
    return "@" + user + " and friends, time to do " + quantity + " " + workout.name;
}

function getWorkoutCommand(twitch, config, command, parameters, user, message) {
	twitch.say(getWorkout(config.admin));
}