'use strict';

angular
  .module('mean.user.ctrls')
  .classy
  .controller({

    name: 'UserHomeCtrl',

    inject: ['UserManager'],

    init: function() {
      this.password = '';
      this.passwordRepeated = '';
    },

    saveUser: function() {

      var self = this;
      this.userSaved = false;

      this.UserManager
        .updateCurrent()
        .then(function() {
          self.userSaved = true;
        });

    },

    changePassword: function() {

      var self = this;
      this.passwordChanged = false;

      this.UserManager
        .changePassword(this.password)
        .then(function() {
          self.passwordChanged = true;
        });

    }

  });
