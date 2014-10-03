'use strict';

angular
  .module('mean.user.ctrls')
  .classy
  .controller({

    name: 'UserResetPasswordCtrl',

    inject: ['$stateParams', 'User']

  });
