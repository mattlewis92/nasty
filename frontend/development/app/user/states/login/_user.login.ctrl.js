'use strict';

angular
  .module('<%= _.slugify(angularAppName) %>.user.states')
  .classy
  .controller({

    name: 'UserLoginCtrl',

    inject: ['user', 'authentication', 'socialNetwork'],

    data: {
      userDetails: {}
    }

  });
