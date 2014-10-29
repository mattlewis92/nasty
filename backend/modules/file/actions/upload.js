'use strict';

var imgur = require('imgur'),
    checksum = require('checksum'),
    prettyBytes = require('pretty-bytes');

module.exports = function(req, res, next, models, config, errors) {

  if (req.body.max_file_size && req.files.file.size > parseInt(req.body.max_file_size)) {
    var humanizedMaxSize = prettyBytes(parseInt(req.body.max_file_size));
    return next(new errors.user('The file size is above the maximum allowed size of %s', humanizedMaxSize));
  }

  if (req.body.allowed_file_types) {
    var allowedTypes = req.body.allowed_file_types.split('|');
    if (allowedTypes.indexOf(req.files.file.type) === -1) {
      return next(
        new errors.user(
          'The file type of %s is not in the allowed file types (%s)', req.files.file.type, allowedTypes.join(',')
        )
      );
    }
  }

  if (req.body.allowed_file_type_group) {
    var fileGroup = req.files.file.type.split('/')[0];
    if (fileGroup !== req.body.allowed_file_type_group) {
      return next(
        new errors.user(
          'The file type of %s is not of the allowed type %s', req.files.file.type, req.body.allowed_file_type_group
        )
      );
    }
  }

  imgur.setClientId(config.get('imgur:token'));

  models.user
    .findFromToken(req.body.token, req.body.fingerprint)
    .then(function(user) {

      //This is just an example, you should probably upload this to AWS or a similar cloud storage provider
      //The result of this promise contains the authenticated user id, you can use this to link the file to the user
      return [user, imgur.uploadFile(req.files.file.path), checksum.fileAsync(req.files.file.path)];

    }).spread(function(user, json, checksum) {

      var file = new models.file({
        name: req.files.file.name,
        size: req.files.file.size,
        mime: req.files.file.type,
        checksum: checksum,
        url: json.data.link,
        owner: user._id
      });

      return file.saveAsync();

    }).spread(function(file) {

      res.json(file.toObject());
      next();

    }).catch(next);

};
