'use strict';

angular
  .module('nasty.user.ctrls')
  .classy
  .controller({

    name: 'UserHomeCtrl',

    inject: ['AuthUser', 'User', 'Config', 'SocialNetwork'],

    data: function() {
      return {
        password: '',
        passwordRepeated: ''
      };
    }

  });
