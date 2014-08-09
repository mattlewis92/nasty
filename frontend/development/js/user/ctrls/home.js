'use strict';

angular
  .module('mean.user.ctrls')
  .controller('UserHomeCtrl', function($scope, AuthUser) {
    $scope.user = AuthUser;
  });
