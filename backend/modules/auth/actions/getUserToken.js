module.exports = function(req, res) {

  res.json({user: req.session.user});
  req.session.destroy();

};
