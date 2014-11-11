'use strict';

/**
 * This is just an example, you should probably upload this to AWS or a
 * similar cloud storage provider rather than imgur which only supports images
 */

var imgur = require('imgur'),
    checksum = require('checksum'),
    bluebird = require('bluebird'),
    fs = require('fs'),
    fileModel = null,
    request = require('request'),
    mmmagic = require('mmmagic'),
    magic = new mmmagic.Magic(false, mmmagic.MAGIC_MIME_TYPE);

bluebird.promisifyAll(magic);
bluebird.promisifyAll(request);

//Change these 2 functions to swap imgur for another cloud provider

function uploadFromFromPath(path) {

  return imgur.uploadFile(path).then(function(json) {
    return json.data.link;
  });

}

function uploadFileFromBuffer(buffer) {

  var base64File = buffer.toString('base64');

  return imgur.uploadBase64(base64File).then(function(json) {
    return json.data.link;
  });

}

//These are generic functions which should work for any cloud provider

function saveFileFromBuffer(buffer, owner, saveToDatabase) {

  var promises = [];
  promises.push(magic.detectAsync(buffer));
  promises.push(uploadFileFromBuffer(buffer));

  return bluebird.all(promises).spread(function(mime, url) {

    var model = fileModel({
      size: buffer.toString().length,
      mime: mime,
      checksum: checksum(buffer),
      url: url,
      owner: owner ? owner._id : null
    });

    if (saveToDatabase === false) {
      return [model]; //wrap in an array to preserve return value format
    } else {
      return model.saveAsync();
    }

  });

}

function saveFileFromBase64(base64File, owner, saveToDatabase) {

  return saveFileFromBuffer(new Buffer(base64File, 'base64'), owner, saveToDatabase);

}

function saveFileFromUrl(url, owner, saveToDatabase) {

  return request.getAsync(url, {encoding: null}).spread(function(response, fileBlob) {
    return saveFileFromBuffer(fileBlob, owner, saveToDatabase);
  });

}

function saveFileFromPath(path, owner, saveToDatabase) {

  var promises = [];

  promises.push(fs.statAsync(path).then(function(stats) { return stats.size; }));
  promises.push(magic.detectFileAsync(path));
  promises.push(checksum.fileAsync(path));
  promises.push(uploadFromFromPath(path));

  return bluebird.all(promises).spread(function(size, mime, checksum, url) {

    var model = fileModel({
      name: path.split('/').pop(),
      size: size,
      mime: mime,
      checksum: checksum,
      url: url,
      owner: owner ? owner._id : null
    });

    if (saveToDatabase === false) {
      return [model]; //wrap in an array to preserve return value format
    } else {
      return model.saveAsync();
    }

  });

}

module.exports = function() {

  return function(config, models) {

    imgur.setClientId(config.get('imgur:token'));
    fileModel = models.file;

    return {
      saveFileFromBase64: saveFileFromBase64,
      saveFileFromUrl: saveFileFromUrl,
      saveFileFromPath: saveFileFromPath
    };

  };

};
