'use strict';

angular
  .module('nasty.app.services')
  .factory('HTTPInterceptor', function($q, $rootScope, $injector) {
    return {
      responseError: function(response) {

        if (401 === response.status) {

          $injector.get('$state').go('user.login').then(function() {
            $injector.get('Authentication').clear();
            $injector.get('ErrorHandler').http(response);
          });

        } else {

          //If the error then gets passed to the generic handler it will know it is http and handle it as such
          response.__isHttp = true;
          if (response.config.autoError !== false) {
            $injector.get('ErrorHandler').http(response);
          }

        }

        return $q.reject(response); // error not handled

      }
    };
  });
