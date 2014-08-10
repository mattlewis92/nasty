'use strict';

angular
  .module('mean.user.services')
  .factory('UserManager', function($timeout, $state, promiseTracker, Restangular, ErrorHandler, Authentication) {

    var service = {};

    service.loadingTracker = promiseTracker();

    service.user = null;

    var getBaseQuery = function() {
      return Restangular.one('user').withHttpConfig({tracker: service.loadingTracker});
    };

    service.login = function(user) {

      return getBaseQuery()
        .doPOST(user, 'authenticate')
        .then(function(result) {
          Authentication.setToken(result.token);
          $state.go('user.home');
        });
    };

    service.logout = function() {
      Authentication.removeToken();
      $state.go('user.login');
    };

    service.register = function(user) {

      return getBaseQuery()
        .doPOST(user, 'register')
        .then(function() {
          return service.login(user);
        })
        .catch(ErrorHandler.http);
    };

    service.refreshCurrent = function() {

      return getBaseQuery()
        .doGET('current')
        .then(function(user) {
          service.user = user;
          return user;
        });
    };

    service.updateCurrent = function() {

      return getBaseQuery()
        .doPUT(service.user, 'update')
        .then(function(user) {
          service.user = user;
          return user;
        })
        .catch(ErrorHandler.http);
    };

    service.changePassword = function(password) {

      return getBaseQuery()
        .doPUT({password: password}, 'password')
        .catch(ErrorHandler.http);
    };

    return service;

  });
