module.exports = function(next) {

  this._processed.hello = 'world';
  next();

}