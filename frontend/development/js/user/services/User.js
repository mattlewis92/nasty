'use strict';

angular
  .module('mean.user.services')
  .factory('User', function($state, Restangular, Authentication) {

    Restangular.addElementTransformer('user', false, function(user) {

      user.addRestangularMethod('register', 'post', 'register');
      user.addRestangularMethod('authenticate', 'post', 'authenticate');
      user.addRestangularMethod('getAuthUser', 'get', 'current');
      user.addRestangularMethod('update', 'put', 'update');
      user.addRestangularMethod('changePassword', 'put', 'password');
      return user;

    });

    Restangular.addResponseInterceptor(function(data, operation, what, url) {

      if ('authenticate' === what && url.indexOf('/user/') > -1) {
        Authentication.setToken(data.token);
        $state.go('user.home');
      }

      return data;

    });

    return Restangular.service('user');

  });
