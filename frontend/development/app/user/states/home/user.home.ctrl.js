'use strict';

angular
  .module('<%= _.slugify(angularAppName) %>.user.states')
  .classy
  .controller({

    name: 'UserHomeCtrl',

    inject: [
      'authUser',
      'userModel',
      'config',
      'socialNetwork',
      'flash',
      'uploader'
    ],

    data: function() {

      var self = this, uploader = new this.uploader(function(promise) {

        promise.then(function(result) {
          self.authUser.avatar = {
            url: result.url,
            file: result._id
          };
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
