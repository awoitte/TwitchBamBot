// Librairies

var express = require('express'),
    http = require('http'),
    io = require('socket.io'),
    fs = require('fs');

module.exports = function(publicFiles) {
    var app = http.createServer(handler),
        socket = io(app),
        openSockets = [];

    app.listen(80);

    function handler(req, res) {
        var internalURL = publicFiles + (req.url === "/" ? "\\index.html" : req.url);

        fs.readFile(internalURL.replace("/", "\\"),
            function(err, data) {
                if (err) {
                    res.writeHead(500);
                    return res.end('Error loading ' + req.url);
                }

                res.writeHead(200);
                res.end(data);
            });
    }

    socket.on('connection', function(socket) {
        console.log('a user connected');
        addSocket(openSockets, socket);

        socket.on('disconnect', function() {
            console.log('user disconnected');
            removeSocket(openSockets, socket);
        });
    });

    return {
    	broadcastEvent: broadcastEvent.bind(null, openSockets)
    };
};

function addSocket (socketList, socket) {
	if(socketList.indexOf(socket) === -1) socketList.push(socket);
}

function removeSocket (socketList, socket) {
	var i = socketList.indexOf(socket);
	if(i === -1) return;
	else socketList.splice(i, 1);
}

function broadcastEvent (openSockets, eventName, data) {
	openSockets.forEach(function (socket) {
		socket.emit(eventName, data);
	});
}