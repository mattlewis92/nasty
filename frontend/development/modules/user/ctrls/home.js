'use strict';

angular
  .module('mean.user.ctrls')
  .classy
  .controller({

    name: 'UserHomeCtrl',

    inject: ['AuthUser', 'User', 'Config'],

    data: function() {
      return {
        password: '',
        passwordRepeated: ''
      }
    }

  });
