'use strict';

angular
  .module('nasty.user.ctrls')
  .classy
  .controller({

    name: 'UserRegisterCtrl',

    inject: ['user', 'socialNetwork'],

    data: {
      userDetails: {}
    }

  });
