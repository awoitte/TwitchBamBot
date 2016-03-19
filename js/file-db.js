var fs = require('fs'),
    clone = require('clone');

module.exports = function(storageName) {
    var data = fs.readFileSync("./data/" + storageName + ".json"),
        db = JSON.parse(data.toString());

    if (!db) db = {};

    return {
        exists: exists,
        create: create,
        get: get.bind(null, db),
        remove: remove.bind(null, db),
        save: save.bind(null, db, storageName),
        all: all.bind(null, db),
        view: view.bind(null, db)
    };
};

function exists(callback) {
    callback(null, true);
}

function create() {
    //Do nothing
}

function get(db, id, callback) {
    var userObj = db[id];

    if (userObj === void 0) callback({
        headers: {
            status: 404
        }
    });
    else callback(null, userObj);
}

function remove(db, id) {
    db[id] = void 0;
}

function save(db, storageName, id, newThing, callback) {
    db[id] = newThing;
    fs.writeFileSync("./data/" + storageName + ".json", JSON.stringify(db));
    if (callback) callback(null, db[id]);

}

function all(db, callback) {
    var things = [];
    for (var id in db) {
        things.push(clone(db[id]));
    }
    callback(null, things);
}

var viewMap = {
    "users/byFlags": byFlag,
    "users/byPoints": byPoints,
    "users/byColours": byColour
}

function view(db, view, callback) {
    var mappingFunc = viewMap[view];
    if (mappingFunc) {
        var things = [];
        for (var id in db) {
            things.push(db[id]);
        }
        callback(null, things.map(mappingFunc));
    }else{
        callback("Can't find mapping Func");
    }
}

function byColour(user) {
    return {
        key: user.name,
        value: user.colour
    }
}

function byFlag(user) {
    return {
        key: user.name,
        value: user.flag
    }
}

function byPoints(user) {
    return {
        key: user.name,
        value: user.points
    }
}