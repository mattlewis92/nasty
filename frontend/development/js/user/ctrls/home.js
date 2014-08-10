'use strict';

angular
  .module('mean.user.ctrls')
  .classy
  .controller({

    name: 'UserHomeCtrl',

    inject: ['UserManager'],

    init: function() {
      this.password = '';
      this.passwordRepeated = '';
    }

  });
