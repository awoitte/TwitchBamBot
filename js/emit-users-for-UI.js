module.exports = function (users, frontEnd){

    setInterval(function() {
            var currentUsers = users.getUserList();
            frontEnd.broadcastEvent("users", currentUsers);
    }, 1000);

    return {

    };
};