'use strict';

angular
  .module('mean.user.ctrls')
  .classy
  .controller({

    name: 'UserHomeCtrl',

    inject: ['AuthUser', 'User', 'Config'],

    init: function() {
      this.password = '';
      this.passwordRepeated = '';
    }

  });
