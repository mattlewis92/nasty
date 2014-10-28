'use strict';

angular
  .module('nasty.user.ctrls')
  .classy
  .controller({

    name: 'UserRegisterCtrl',

    inject: ['User', 'SocialNetwork'],

    data: {
      user: {}
    }

  });
