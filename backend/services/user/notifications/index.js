'use strict';

var socketIO = require('socket.io'),
    redis = require('socket.io-redis'),
    socketIOEmitter = require('socket.io-emitter'),
    socketioJwt = require('socketio-jwt');

module.exports = function() {

  return function(config) {

    var io = socketIOEmitter(config.get('redis'));

    function init(http) {
      io = socketIO(http);

      io.adapter(redis(config.get('redis')));

      io.on('connection', socketioJwt.authorize({
        secret: config.get('jwtKey'),
        timeout: 10000 // 10 seconds to send the authentication message
      })).on('authenticated', function(socket) {
        socket.join('user.' + socket.decoded_token.user._id);
      });
    }

    return {
      init: init,
      getIO: function() {
        return io;
      },
      isUserOnline: function(userId) {
        var room = io.sockets.adapter.rooms['user.' + userId];
        return (!!room && Object.keys(room).length > 0);
      },
      emitToUser: function(userId, event, data) {
        io.to('user.' + userId).emit(event, data);
      },
      emitToAll: function(event, data) {
        io.emit(event, data);
      }
    };

  };

};
