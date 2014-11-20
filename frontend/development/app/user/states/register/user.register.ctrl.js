'use strict';

angular
  .module('nasty.user.states')
  .classy
  .controller({

    name: 'UserRegisterCtrl',

    inject: ['user', 'socialNetwork'],

    data: {
      userDetails: {}
    }

  });
