'use strict';

angular
  .module('mean.user.ctrls')
  .classy
  .controller({

    name: 'UserHomeCtrl',

    inject: ['AuthUser', 'UserManager'],

    init: function() {
      this.password = '';
      this.passwordRepeated = '';
    }

  });
