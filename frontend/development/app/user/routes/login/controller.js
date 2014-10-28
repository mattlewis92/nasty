'use strict';

angular
  .module('nasty.user.routes')
  .classy
  .controller({

    name: 'UserLoginCtrl',

    inject: ['user', 'authentication', 'socialNetwork'],

    data: {
      userDetails: {}
    }

  });
