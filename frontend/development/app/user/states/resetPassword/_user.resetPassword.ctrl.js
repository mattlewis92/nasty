'use strict';

angular
  .module('<%= _.slugify(angularAppName) %>.user.states')
  .classy
  .controller({

    name: 'UserResetPasswordCtrl',

    inject: ['$stateParams', 'user']

  });
