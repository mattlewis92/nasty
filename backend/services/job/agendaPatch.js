'use strict';

var agenda = require('agenda'),
  humanInterval = require('human-interval'),
  CronTime = require('cron').CronTime;

//Monkey patch agenda so that it starts at the beginning of the interval not straight away
agenda.prototype.every = function(interval, names, data) {
  var self = this,
    startAt = null;

  try {
    var cronTime = new CronTime(interval);
    startAt = cronTime._getNextDateFrom(new Date());
  } catch (e) {

    try {
      var intervalMil = humanInterval(interval),
        currentTime = (new Date()).getTime();
      startAt = new Date(Math.ceil(currentTime / intervalMil) * intervalMil);

    } catch (e) {
      console.error('Could not parse frequency %s for worker %s', interval, names);
    }

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
    return names.map(function(name) {
      return createJob(interval, name, data);
    });
  }

  if (typeof names === 'string') {
    return createJob(interval, names, data);
  } else if (Array.isArray(names)) {
    return createJobs(interval, names, data);
  }
};