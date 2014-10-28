'use strict';

angular
  .module('nasty.user.routes')
  .classy
  .controller({

    name: 'UserResetPasswordCtrl',

    inject: ['$stateParams', 'user']

  });
