module.exports = function(app, actions) {

  app.get('/test', actions.test);

  return app;

}