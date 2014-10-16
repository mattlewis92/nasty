'use strict';

var application = require(__dirname + '/../application'),
    app = new application(),
    debug = require('debug')('worker:master'),
    requireAll = require('require-all'),
    services = app.loadServices(__dirname + '/../services', __dirname + '/../../'),
    workers = requireAll(__dirname);

delete workers.index;

debug('STARTING WORKERS');

services.get('job').initWorkers(workers, services, !!process.env.CRON_RUNNER);
