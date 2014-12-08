'use strict';

angular
  .module('<%= _.slugify(angularAppName) %>.core.services')
  .factory('httpInterceptor', function($q, $rootScope, $injector, $timeout) {
    return {
      responseError: function(response) {

        if (401 === response.status) {

          $timeout(function() {
            $injector.get('userModel').logoutRedirect().then(function() {
              $injector.get('authentication').clear();
              $injector.get('errorHandler').http(response);
            });
          });

        } else {

          //If the error then gets passed to the generic handler it will know it is http and handle it as such
          response.__isHttp = true;
          if (response.config.autoError !== false) {
            $injector.get('errorHandler').http(response);
          }

        }

        return $q.reject(response); // error not handled

      }
    };
  });
