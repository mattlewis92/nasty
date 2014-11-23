'use strict';

angular
  .module('<%= _.slugify(angularAppName) %>.user.services')
  .factory('authentication', function($http, DSHttpAdapter, Fingerprint, $localStorage, $sessionStorage, socket) {

    var STORAGE_KEY = 'authToken';

    function getStorageDriver(isPersistent) {
      return isPersistent ? $localStorage : $sessionStorage;
    }

    var service = {};

    service.isPersistent = true;

    service.store = function(data) {
      getStorageDriver(service.isPersistent)[STORAGE_KEY] = angular.copy(data);
      service.setHeaders();
      service.socketEmitAuthToken();
      return this;
    };

    service.retrieve = function() {
      if (getStorageDriver(true)[STORAGE_KEY]) {
        return getStorageDriver(true)[STORAGE_KEY];
      } else if (getStorageDriver(false)[STORAGE_KEY]) {
        return getStorageDriver(false)[STORAGE_KEY];
      } else {
        return null;
      }
      return this;
    };

    service.clear = function() {
      delete getStorageDriver(true)[STORAGE_KEY];
      delete getStorageDriver(false)[STORAGE_KEY];
      return this;
    };

    service.isAuthenticated = function() {
      return !!service.retrieve();
    };

    service.getBrowserFingerprint = function() {
      return new Fingerprint().get({canvas: true, screen_resolution: true});
    };

    service.setHeaders = function() {
      var headers = {};
      headers['Client-Identifier'] = service.getBrowserFingerprint();
      if (service.isAuthenticated()) {
        headers.Authorization = 'Bearer ' + service.retrieve().token;
      }
      angular.extend(DSHttpAdapter.defaults.$httpConfig, {headers: headers});
      angular.extend($http.defaults.headers.common, headers);
      return this;
    };

    service.socketAuthInit = function() {

      socket.on('connect', service.socketEmitAuthToken);
      return this;

    };

    service.socketEmitAuthToken = function() {
      if (service.isAuthenticated()) {
        socket.emit('authenticate', {token: service.retrieve().token});
      }
      return this;
    };

    return service;

  });
