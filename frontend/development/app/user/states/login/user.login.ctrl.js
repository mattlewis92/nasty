'use strict';

angular
  .module('<%= _.slugify(angularAppName) %>.user.states')
  .classy
  .controller({

    name: 'UserLoginCtrl',

    inject: ['userModel', 'authentication', 'socialNetwork'],

    data: {
      userDetails: {}
    }

  });
