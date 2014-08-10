'use strict';

angular
  .module('mean.user.ctrls')
  .classy
  .controller({

    name: 'UserLoginCtrl',

    inject: ['UserManager', 'Authentication'],

    init: function() {
      this.user = {};
    }

  });
