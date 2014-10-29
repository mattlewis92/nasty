'use strict';

angular
  .module('nasty.user.routes')
  .classy
  .controller({

    name: 'UserHomeCtrl',

    inject: ['authUser', 'user', 'config', 'socialNetwork', 'flash', 'uploader'],

    data: function() {

      var self = this, uploader = new this.uploader(function(promise) {

        promise.then(function(result) {
          self.authUser.avatar = result.url;
        }).catch(function(error) {
          self.flash.error(error.response.message, 'avatarError', true);
        });

      }, 'image', 1024 * 1024 * 5);

      return {
        uploader: uploader,
        password: '',
        passwordRepeated: ''
      };

    }

  });
