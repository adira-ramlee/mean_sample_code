"use strict";

var log = require("../libs/log")(module) || "";

exports.run = function(io) {
	var clients = {};
    var players = [];
	io.sockets.on("connection", function(socket) {
		log.info("SOCKET_CONNECTION: " + socket.id);
		socket.emit("connected", { socketId: socket.id });
        clients[socket.id] = {
            socket: socket,
            dashboards: [],
            presentations: [],
            deviceConfigs: [],
            deviceInfo: {}
        };	

        socket.on('enter_room', function(data) {
        	io.sockets.emit('players_name_response', data);

        });
        
        socket.on('givePts', function(data) {
            var isRegisteredPlayer = false;
            if (players.length == 0)
                players.push(data);
            else {
                var i = 0;
                for ( i = 0; i < players.length; i ++)
                {
                    if (players[i].name == data.name)
                    {
                        isRegisteredPlayer = true;
                        players[i].point = data.point;
                    }

                }                   
                if (!isRegisteredPlayer)
                    players.push(data);
            }
            log.info(players.length);
            io.sockets.emit('pts_response', data);
        });

        socket.on('all_finished', function(data) {
            io.sockets.emit('finished_response', players)
        });
        
        socket.on("disconnect", function () {
            delete clients[socket.id];
            log.info("SOCKET_DISCONNECT: " + socket.id);
        });        
	});
};