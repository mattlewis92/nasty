'use strict';

angular
  .module('nasty.user.ctrls')
  .classy
  .controller({

    name: 'UserLoginCtrl',

    inject: ['user', 'authentication', 'socialNetwork'],

    data: {
      userDetails: {}
    }

  });
