'use strict';

angular
  .module('nasty.user.ctrls')
  .classy
  .controller({

    name: 'UserLoginCtrl',

    inject: ['User', 'Authentication', 'SocialNetwork'],

    data: {
      user: {}
    }

  });
