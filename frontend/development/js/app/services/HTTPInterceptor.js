'use strict';

angular
  .module('mean.app.services')
  .factory('HTTPInterceptor', function($q, $rootScope, ErrorHandler) {
    return {
      responseError: function(response) {

        if (401 === response.status) {
          $rootScope.$broadcast('user.unauthorized', response); //A nasty hack because we cant inject $state here
        } else {
          //If the error then gets passed to the generic handler it will know it is http and handle it as such
          response.__isHttp = true;
          if (response.config.autoError !== false) {
            ErrorHandler.http(response);
          }
        }

        return $q.reject(response); // error not handled

      }
    };
  });
