module.exports = function (frontEnd, command, parameters, user, message){
    frontEnd.broadcastEvent("sfx", "SFX/" + parameters + ".mp3");
};