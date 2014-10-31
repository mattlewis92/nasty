'use strict';

/**
 * This is just an example, you should probably upload this to AWS or a
 * similar cloud storage provider rather than imgur which only supports images
 * @type {exports}
 */

var imgur = require('imgur'),
    checksum = require('checksum');

function saveFileFromBase64(base64File) {

  return imgur.uploadBase64(base64File).then(function(json) {
    return json.data.link;
  });

}

function saveFileFromUrl(url) {

  return imgur.uploadUrl(url).then(function(json) {
    return json.data.link;
  });

}

function saveFileFromPath(path) {

  return imgur.uploadFile(path).then(function(json) {
    return json.data.link;
  });

}

function getFileChecksumFromPath(path) {

  return checksum.fileAsync(path);

}

module.exports = function() {

  return function(config) {

    imgur.setClientId(config.get('imgur:token'));

    return {
      saveFileFromBase64: saveFileFromBase64,
      saveFileFromUrl: saveFileFromUrl,
      saveFileFromPath: saveFileFromPath,
      getFileChecksumFromPath: getFileChecksumFromPath
    }

  }

}
