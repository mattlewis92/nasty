'use strict';

angular
  .module('mean.user.ctrls')
  .classy
  .controller({

    name: 'UserRegisterCtrl',

    inject: ['User'],

    data: {
      user: {}
    }

  });
