'use strict';

angular
  .module('mean.user.services')
  .factory('Authentication', function(DSHttpAdapter, Fingerprint, $localStorage, $sessionStorage, Socket) {

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
    };

    service.retrieve = function() {
      if (getStorageDriver(true)[STORAGE_KEY]) {
        return getStorageDriver(true)[STORAGE_KEY];
      } else if (getStorageDriver(false)[STORAGE_KEY]) {
        return getStorageDriver(false)[STORAGE_KEY];
      } else {
        return null;
      }
    };

    service.clear = function() {
      delete getStorageDriver(true)[STORAGE_KEY];
      delete getStorageDriver(false)[STORAGE_KEY];
    };

    service.isAuthenticated = function() {
      return !!service.retrieve();
    };

    service.getBrowserFingerprint = function() {
      return new Fingerprint().get({canvas: true, screen_resolution: true});
    };

    service.setHeaders = function() {
      var headers = {};
      headers['x-finger-print'] = service.getBrowserFingerprint();
      if (service.isAuthenticated()) {
        headers['x-access-token'] = service.retrieve().token;
      }
      angular.extend(DSHttpAdapter.defaults.$httpConfig, {headers: headers});
    };

    service.socketAuthInit = function() {

      Socket.on('connect', service.socketEmitAuthToken);

    };

    service.socketEmitAuthToken = function() {
      if (service.isAuthenticated()) {
        Socket.emit('authenticate', {token: service.retrieve().token});
      }
    };

    return service;

  });
