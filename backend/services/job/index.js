'use strict';

var agenda = require('agenda'),
    worker = require(__dirname + '/worker');

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

    function queue(name, data, onComplete, onCompleteData) {
      if (onComplete) {
        data = data || {};
        data.__onComplete = onComplete;
        data.__onCompleteData = onCompleteData;
      }
      agendaInstance.now(name, data);
    }

     function schedule(when, name, data, onComplete, onCompleteData) {
      if (onComplete) {
        data = data || {};
        data.__onComplete = onComplete;
        data.__onCompleteData = onCompleteData;
      }
      agendaInstance.schedule(when, name, data);
    }

    return {
      worker: worker,
      agenda: agendaInstance,
      queue: queue,
      schedule: schedule
    };

  };

};