'use strict';

angular
  .module('mean.user.ctrls')
  .classy
  .controller({

    name: 'UserRegisterCtrl',

    inject: ['UserManager'],

    init: function() {
      this.user = {};
    }

  });
