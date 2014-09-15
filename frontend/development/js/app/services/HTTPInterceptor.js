'use strict';

angular
  .module('mean.app.services')
  .factory('HTTPInterceptor', function($q, $rootScope) {
    return {
      responseError: function(response) {

        if (401 === response.status) {
          $rootScope.$broadcast('user.unauthorized', response); //A nasty hack because we cant inject $state here
          return response;
        } else {
          //If the error then gets passed to the generic handler it will know it is http and handle it as such
          response.__isHttp = true;
        }

        return $q.reject(response); // error not handled

      }
    };
  });
