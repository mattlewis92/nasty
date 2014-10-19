'use strict';

angular
  .module('nasty.user.ctrls')
  .classy
  .controller({

    name: 'UserResetPasswordCtrl',

    inject: ['$stateParams', 'User']

  });
