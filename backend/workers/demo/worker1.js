module.exports = function(worker, services, debug) {

  worker
    .concurrency(1)
    .frequency('1 minute')
    .action(function(job) {
      debug('HELLO WORLD!');
    });
  
};