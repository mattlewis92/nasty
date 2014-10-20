'use strict';

var expressSession = require('express-session'),
    RedisStore = require('connect-redis')(expressSession);

module.exports = function() {

  return function(config) {

    var sessionConfig = config.get('session');
    sessionConfig.store = new RedisStore(config.get('redis'));
    var session = expressSession(sessionConfig);

    return session;

  };

};
