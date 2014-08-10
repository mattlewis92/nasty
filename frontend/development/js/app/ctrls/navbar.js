'use strict';

angular
  .module('mean.app.ctrls')
  .controller('AppNavbarCtrl', function($scope, $state, Authentication) {

    var self = this;

    $scope.$watch(function() {
      return Authentication.getToken();
    }, function(token) {
      self.isLoggedIn = !!token;
    });

    $scope.logout = function() {
      Authentication.removeToken();
      $state.go('user.login');
    };

  });
