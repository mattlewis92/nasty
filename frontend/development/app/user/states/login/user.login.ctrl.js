'use strict';

angular
  .module('nasty.user.states')
  .classy
  .controller({

    name: 'UserLoginCtrl',

    inject: ['userModel', 'authentication', 'socialNetwork'],

    data: {
      userDetails: {}
    }

  });
