module.exports = function(callback, frequencyCallback) {
    loop(callback, frequencyCallback)
};

function loop(callback, frequencyCallback) {
    callback();
    setTimeout(loop.bind(null, callback, frequencyCallback), frequencyCallback());
}
