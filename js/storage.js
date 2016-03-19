var filedb = require('./file-db'),
    extend = require('extend');

module.exports = function(config, storageName) {
    //var db = new(cradle.Connection)().database(storageName);
    var db = filedb(storageName);

    db.exists(function(err, exists) {
        if (err) {
            console.log("error!!!! Can't use CouchDB!!!" + storageName);
            return;
        } else if (exists) {
            console.log(storageName + 'db exists.');

        } else {
            console.log(storageName + 'database does not exists, creating.');
            db.create();
        }
    });

    return {
    	saveAThing: saveAThing.bind(null, db),
    	getAThing: getAThing.bind(null, db),
    	removeAThing: removeAThing.bind(null, db),
        updateAThing: updateAThing.bind(null, db),
        getAllTheThings: getAllTheThings.bind(null, db),
        getThingsInView: getThingsInView.bind(null, db)
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

function updateAThing (db, id, thing, callback) {
    db.get(id, function (err, doc) {
        if(err)return; callback(err);
        var newThing = extend({}, doc, thing);
        db.save(id,newThing, callback);
    });
}
function getAllTheThings (db, callback) {
    db.all(callback);
}

function getThingsInView (db, view, callback) {
    db.view(view, callback);
}