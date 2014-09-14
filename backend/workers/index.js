'use strict';

var application = require(__dirname + '/../components/application'),
    app = new application(),
    requireAll = require('require-all'),
    services = app.loadServices(__dirname + '/../services', __dirname + '/../../'),
    workers = requireAll(__dirname);

delete workers.index;

console.log('STARTING WORKERS');

services.get('job').initWorkers(workers, services, !!process.env.CRON_RUNNER);
