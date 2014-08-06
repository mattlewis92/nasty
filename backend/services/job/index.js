'use strict';

var agenda = require('agenda'),
    worker = require(__dirname + '/worker');

//Monkey patch agenda so that it starts at the beginning of the interval not straight away
agenda.prototype.every = function(interval, names, data) {
  var self = this;

  var startAt = null;

  try {
    var cronTime = new CronTime(interval);
    startAt = cronTime._getNextDateFrom(new Date());
  } catch (e) {

    try {
      var intervalMil = humanInterval(interval);
      var currentTime = (new Date).getTime();
      startAt = new Date(Math.ceil(currentTime / intervalMil) * intervalMil);

    } catch(e) {
      console.error('Could not parse frequency %s for worker %s', interval, names);
    }

  }

  if (typeof names === 'string') {
    return createJob(interval, names, data);
  } else if (Array.isArray(names)) {
    return createJobs(interval, names, data);
  }

  function createJob(interval, name, data) {
    var job;
    job = self.create(name, data);
    job.attrs.type = 'single';
    if (startAt) {
      job.attrs.nextRunAt = startAt;
    }
    job.repeatEvery(interval);
    job.save();
    return job;
  }

  function createJobs(interval, names, data) {
    return names.map(function (name) {
      return createJob(interval, name, data);
    });
  }
};

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