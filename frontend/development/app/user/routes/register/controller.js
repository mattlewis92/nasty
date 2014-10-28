'use strict';

angular
  .module('nasty.user.routes')
  .classy
  .controller({

    name: 'UserRegisterCtrl',

    inject: ['user', 'socialNetwork'],

    data: {
      userDetails: {}
    }

  });
