'use strict';

angular
  .module('mean.user.services')
  .factory('Authentication', function(DSHttpAdapter, Fingerprint, $localStorage, $sessionStorage) {

    var STORAGE_KEY = 'authToken';

    function getStorageDriver(isPersistent) {
      return isPersistent ? $localStorage : $sessionStorage;
    }

    var service = {};

    service.isPersistent = true;

    service.setToken = function(token) {
      getStorageDriver(service.isPersistent)[STORAGE_KEY] = angular.copy(token);
      service.setHeaders();
    };

    service.getToken = function() {
      if (getStorageDriver(true)[STORAGE_KEY]) {
        return getStorageDriver(true)[STORAGE_KEY];
      } else if (getStorageDriver(false)[STORAGE_KEY]) {
        return getStorageDriver(false)[STORAGE_KEY];
      } else {
        return null;
      }
    };

    service.removeToken = function() {
      delete getStorageDriver(true)[STORAGE_KEY];
      delete getStorageDriver(false)[STORAGE_KEY];
    };

    service.hasToken = function() {
      return !!service.getToken();
    };

    service.getBrowserFingerprint = function() {
      return new Fingerprint().get({canvas: true, screen_resolution: true});
    };

    service.setHeaders = function() {
      var headers = {};
      headers['x-finger-print'] = service.getBrowserFingerprint();
      if (service.getToken()) {
        headers['x-access-token'] = service.getToken().token;
      }
      angular.extend(DSHttpAdapter.defaults.$httpConfig, {headers: headers});
    };

    return service;

  });
