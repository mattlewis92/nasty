'use strict';

angular
  .module('nasty.user.states')
  .classy
  .controller({

    name: 'UserLoginCtrl',

    inject: ['user', 'authentication', 'socialNetwork'],

    data: {
      userDetails: {}
    }

  });
