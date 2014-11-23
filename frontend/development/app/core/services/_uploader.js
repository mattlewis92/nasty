'use strict';

angular
  .module('<%= _.slugify(angularAppName) %>.core.services')
  .factory('uploader', function($q, FileUploader, authentication) {

    return function(fileAddedCallback, allowedFileTypes, maximumFileSize, formData, options) {

      fileAddedCallback = fileAddedCallback || angular.noop();
      options = options || {};
      formData = formData || {};

      if (allowedFileTypes) {
        if (angular.isArray(allowedFileTypes)) {
          formData.allowed_file_types = allowedFileTypes.join('|');
        } else {
          formData.allowed_file_type_group = allowedFileTypes;
        }
      }

      if (maximumFileSize) {
        formData.max_file_size = maximumFileSize;
      }

      //Send auth as post data rather than headers for better backwards browser compatibility
      var
        defaultFormData = {
          token: authentication.retrieve().token,
          fingerprint: authentication.getBrowserFingerprint()
        },
        defaultOptions = {
          url: '/file/upload',
          autoUpload: true,
          removeAfterUpload: true,
          formData: [
            angular.extend(defaultFormData, formData)
          ]
        },
        fileuploader = new FileUploader(angular.extend(defaultOptions, options)),
        promises = {};

      function getIndex(item) {
        var result = null;
        fileuploader.queue.forEach(function(_item, index) {
          if (item === _item) {
            result = index;
          }
        });
        return result;
      }

      fileuploader.onAfterAddingFile = function(item) {
        var deferred = $q.defer();
        promises[getIndex(item)] = deferred;
        fileAddedCallback(deferred.promise);
      };

      fileuploader.onSuccessItem = function(item, response) {
        promises[getIndex(item)].resolve(response);
      };

      fileuploader.onProgressItem = function(item, progress) {
        promises[getIndex(item)].notify(progress);
      };

      fileuploader.onErrorItem = function(item, response, status, headers) {
        promises[getIndex(item)].reject({response: response, status: status, headers: headers});
      };

      return fileuploader;

    };

  });
