'use strict';

var socketIO = require('socket.io'),
    redis = require('socket.io-redis'),
    socketioJwt = require('socketio-jwt');

module.exports = function() {

  return function(config) {

    var io = null;

    function init(http) {
      io = socketIO(http);

      io.adapter(redis());

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
      emitToUser: function(userId, event, data) {
        io.to('user.' + userId).emit(event, data);
      },
      emitToAllUsers: function(event, data) {
        io.emit(event, data);
      }
    };

  };

};
