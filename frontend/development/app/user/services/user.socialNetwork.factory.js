'use strict';

angular
  .module('<%= _.slugify(angularAppName) %>.user.services')
  .factory('socialNetwork', function($http, $window, $location, $timeout, $state, authentication, userModel) {

    var socialNetwork = {};

    socialNetwork.authorize = function(provider, redirect) {

      return $http.post('/auth/user/authorize', {}).then(function() {

        redirect = redirect || $location.path();
        $window.location.href = '/auth/' + provider + '/authorize?redirect=' + encodeURIComponent(redirect);

      });

    };

    socialNetwork.authenticate = function(provider, redirect) {

      redirect = redirect || $location.path();
      redirect += '?authCallback=1';

      $window.location.href = '/auth/' + provider + '/authenticate?fingerprint=' +
        authentication.getBrowserFingerprint() + '&redirect=' + encodeURIComponent(redirect);

    };

    socialNetwork.authenticateCallback = function() {

      return $http.get('/auth/user/token').success(function(result) {

        authentication.store(result.auth);
        $timeout(function() {
          userModel.loginRedirect();
        });

      });

    };

    return socialNetwork;

  });
