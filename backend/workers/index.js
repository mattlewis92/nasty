'use strict';

var application = require(__dirname + '/../components/application'),
    app = new application(),
    requireAll = require('require-all'),
    debug = require('debug'),
    services = app.loadServices(__dirname + '/../services', __dirname + '/../../'),
    agenda = services.get('job').agenda,
    worker = services.get('job').worker,
    workers = requireAll(__dirname);

delete workers.index;

for (var folder in workers) {
  for (var job in workers[folder]) {

    var workerInstance = new worker(),
        jobName = folder + ':' + job;
    workers[folder][job](workerInstance, services, debug(jobName));

    if (!workerInstance.job) {
      throw new Error(jobName + ' does not have a job function defined!');
    }

    agenda.define(jobName, workerInstance.options, workerInstance.job);

    if (workerInstance.frequency) {
      agenda.every(workerInstance.frequency, jobName);
    }

  }
}

function handleJobComplete(job, err) {
  if (job.attrs.data && job.attrs.data.__onComplete) {
    var jobName = job.attrs.data.__onComplete,
        data = job.attrs.data.__onCompleteData || {};
    if (err) {
      data.__previousError = err;
    }
    data.__previousJob = job.attrs.name;
    agenda.now(jobName, data);
  }

  if (!job.attrs.nextRunAt) {
    job.agenda._db.remove({_id: job.attrs._id}, function() {});
  }

  /* jshint ignore:start */
  startListeners();
  /* jshint ignore:end */
}

function startListeners() {
  agenda.once('success', handleJobComplete);

  agenda.once('fail', function(err, job) {
    handleJobComplete(job, err);
  });
}

startListeners();

function graceful() {
  agenda.stop(function() {
    process.exit(0);
  });
}

process.on('SIGTERM', graceful);
process.on('SIGINT' , graceful);

agenda.start();