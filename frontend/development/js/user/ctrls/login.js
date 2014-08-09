'use strict';

angular
  .module('mean.user.ctrls')
  .controller('UserLoginCtrl', function($scope, $state, promiseTracker, User, Authentication) {

    $scope.loadingTracker = promiseTracker();
    $scope.user = {};
    $scope.Authentication = Authentication;

    $scope.login = function() {
      User
        .one()
        .withHttpConfig({tracker: $scope.loadingTracker})
        .authenticate($scope.user);
    };

    if (Authentication.getToken()) {
      $state.go('user.home');
    }

  });
