'use strict';

angular
  .module('nasty.user.ctrls')
  .classy
  .controller({

    name: 'UserHomeCtrl',

    inject: ['authUser', 'user', 'config', 'socialNetwork'],

    data: function() {
      return {
        password: '',
        passwordRepeated: ''
      };
    }

  });
