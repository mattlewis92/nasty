'use strict';

angular
  .module('mean.user.ctrls')
  .controller('UserHomeCtrl', function(AuthUser) {
    this.user = AuthUser;
  });
