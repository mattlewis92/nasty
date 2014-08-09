'use strict';

angular
  .module('mean.app.ctrls')
  .controller('AppNavbarCtrl', function($scope, $state, Authentication) {

    $scope.$watch(function() {
      return Authentication.getToken();
    }, function(token) {
      $scope.isLoggedIn = !!token;
    });

    $scope.logout = function() {
      Authentication.removeToken();
      $state.go('user.login');
    };

  });
