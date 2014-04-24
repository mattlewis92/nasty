module.exports = function(something, res, errors, next) {

  return next(new Error('This is an example user error!'));

  res.json({hello: something});

}