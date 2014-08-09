'use strict';

angular
  .module('mean.user.services')
  .factory('User', function($state, Restangular, Authentication, ErrorHandler) {

    Restangular.addElementTransformer('user', false, function(user) {

      user.addRestangularMethod('register', 'post', 'register');
      user.addRestangularMethod('authenticate', 'post', 'authenticate');
      user.addRestangularMethod('getAuthUser', 'get', 'current');
      return user;

    });

    Restangular.addResponseInterceptor(function(data, operation, what, url) {

      if ('authenticate' === what && url.indexOf('/user/') > -1) {
        Authentication.setToken(data.token);
        $state.go('user.home');
      }

      return data;

    });

    Restangular.setErrorInterceptor(function(response) {

      if (401 === response.status) {
        $state.go('user.login').then(function() {
          ErrorHandler.http(response);
        });
      }

      return true; // error not handled
    });

    return Restangular.service('user');

  });
