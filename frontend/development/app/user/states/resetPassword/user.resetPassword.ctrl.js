'use strict';

angular
  .module('nasty.user.states')
  .classy
  .controller({

    name: 'UserResetPasswordCtrl',

    inject: ['$stateParams', 'userModel']

  });
