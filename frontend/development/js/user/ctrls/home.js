'use strict';

angular
  .module('mean.user.ctrls')
  .classy
  .controller({

    name: 'UserHomeCtrl',

    inject: ['AuthUser', 'User'],

    init: function() {
      this.password = '';
      this.passwordRepeated = '';
    }

  });
