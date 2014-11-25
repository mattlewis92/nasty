'use strict';

angular
  .module('nasty.user.states')
  .classy
  .controller({

    name: 'UserRegisterCtrl',

    inject: ['userModel', 'socialNetwork'],

    data: {
      userDetails: {}
    }

  });
