'use strict';

angular
  .module('mean.user.ctrls')
  .controller('UserRegisterCtrl', function($scope, $state, promiseTracker, User, ErrorHandler) {

    $scope.loadingTracker = promiseTracker();

    $scope.user = {};

    $scope.register = function() {

      User
        .one()
        .withHttpConfig({tracker: $scope.loadingTracker})
        .register($scope.user)
        .then(function() {
          return User.one()
            .withHttpConfig({tracker: $scope.loadingTracker})
            .authenticate({email: $scope.user.email, password: $scope.user.password});
        })
        .catch(ErrorHandler.http);

    };

  });
