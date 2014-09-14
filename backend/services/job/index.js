'use strict';

var kue = require('kue'),
    bluebird = require('bluebird'),
    debug = require('debug'),
    CronJob = require('cron').CronJob,
    worker = require('./worker'),
    queue = kue.createQueue();

module.exports = function() {

  return function(config) {

    function queueJob(name, data, onComplete, onCompleteData, options) {

      if (onComplete) {
        data = data || {};
        data.__onComplete = onComplete;
        data.__onCompleteData = onCompleteData;
      }

      var job = queue.create(name, data);

      options = options || {};

      if (options.priority) {
        job = job.priority(options.priority);
      }

      if (options.attempts) {
        job = job.attempts(options.attempts);
      }

      if (options.backoff) {
        job = job.backoff(options.backoff);
      }

      if (options.delay) {
        job = job.delay(options.delay);
      }

      return new bluebird(function(resolve, reject) {

        job.save(function(err) {
          if (err) {
            reject(err);
          } else {
            resolve(job);
          }
        });

      });

    }

    function handleJobComplete(id) {

      kue.Job.get(id, function(err, job) {

        if (job.data && job.data.__onComplete) {
          var jobName = job.data.__onComplete,
            data = job.data.__onCompleteData || {};

          if (job._error) {
            data.__previousError = job._error;
          }

          data.__previousJob = job.type;

          queueJob(jobName, data);

        }

        job.remove(); //just delete it once we're done

      });

    }

    function cancelJob(id) {

      return new bluebird(function(resolve, reject) {

        kue.Job.get(id, function(err, job) {
          if (err) {
            return reject(err);
          }

          job.remove(function(err) {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });

        });

      });
    }

    function gracefulShutdown() {
      queue.shutdown(function() {
        process.exit(0);
      }, 5000);
    }

    function createCron(jobName, frequency) {
      new CronJob(frequency, function() {

        queueJob(jobName);

      }, null, true, 'Etc/UTC');
    }

    function initWorkers(workers, services, cronOnly) {

      for (var folder in workers) {
        for (var job in workers[folder]) {

          var workerInstance = new worker(),
            jobName = folder + ':' + job;

          workers[folder][job](workerInstance, services, debug('worker:' + jobName));

          if (!workerInstance.job) {
            throw new Error(jobName + ' does not have a job function defined!');
          }

          var concurrency = workerInstance.options.concurrency || 1;

          if (cronOnly) {

            if (workerInstance.options.frequency) {

              createCron(jobName, workerInstance.options.frequency);

            }

          } else {
            queue.process(jobName, concurrency, workerInstance.job);
          }

        }
      }

      if (cronOnly) {

        queue.on('job complete', handleJobComplete);
        queue.on('job failed', handleJobComplete);
        queue.promote(); //check delayed jobs with a timer
        kue.app.listen(config.get('kue:adminPort'));

      }

      process.on('SIGTERM', gracefulShutdown);
      process.on('SIGINT' , gracefulShutdown);

    }

    return {
      queue: queueJob,
      cancelJob: cancelJob,
      initWorkers: initWorkers
    };

  };

};
