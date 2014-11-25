'use strict';

angular
  .module('<%= _.slugify(angularAppName) %>.user.states')
  .classy
  .controller({

    name: 'UserRegisterCtrl',

    inject: ['userModel', 'socialNetwork'],

    data: {
      userDetails: {}
    }

  });
