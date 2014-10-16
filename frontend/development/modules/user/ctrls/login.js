'use strict';

angular
  .module('mean.user.ctrls')
  .classy
  .controller({

    name: 'UserLoginCtrl',

    inject: ['User', 'Authentication'],

    data: {
      user: {}
    }

  });
