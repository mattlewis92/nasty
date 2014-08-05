var agenda = require('agenda'),
    worker = require(__dirname + '/worker')
    uuid = require('node-uuid');

module.exports = function() {

  return function(config) {

    var agendaConfig = config.get('agenda'),

    agendaInstance = new agenda({
      db: {
        address: config.get('mongo').host + ':' + config.get('mongo').port + '/' + config.get('mongo').database,
        collection: agendaConfig.collection || 'agendaJobs'
      }
    });

    ['processEvery', 'maxConcurrency', 'defaultConcurrency', 'defaultLockLifetime'].forEach(function(key) {
      if (agendaConfig[key]) {
        agendaInstance[key](agendaConfig[key]);
      }
    });

    var queue = function(name, data, onComplete, onCompleteData) {
      if (onComplete) {
        data = data || {};
        data.__onComplete = onComplete;
        data.__onCompleteData = onCompleteData;
      }
      agendaInstance.now(name, data);
    };

    var schedule = function(when, name, data, onComplete, onCompleteData) {
      if (onComplete) {
        data = data || {};
        data.__onComplete = onComplete;
        data.__onCompleteData = onCompleteData;
      }
      agendaInstance.schedule(when, name, data);
    };

    return {
      worker: worker,
      agenda: agendaInstance,
      queue: queue,
      schedule: schedule
    };

  };

};