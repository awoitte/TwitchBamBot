var cradle = require('cradle');

module.exports = function(config) {
    var db = new(cradle.Connection)().database('twitchbot');

    db.exists(function(err, exists) {
        if (err) {
            console.log("error!!!! Can't use CouchDB!!!");
            return;
        } else if (exists) {
            console.log('twitchbot db exists.');

        } else {
            console.log('database does not exists, creating.');
            db.create();
        }
    });

    return {
    	saveAThing: saveAThing.bind(null, db),
    	getAThing: getAThing.bind(null, db),
    	removeAThing: removeAThing.bind(null, db)
    };
};


function saveAThing (db, id, thing) {
	db.save(id,thing);
}

function getAThing (db, id, callback) {
	db.get(id, callback);
}

function removeAThing (db,id) {
	db.remove(id);
}