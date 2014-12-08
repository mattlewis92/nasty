'use strict';

angular
  .module('<%= _.slugify(angularAppName) %>.user.states')
  .classy
  .controller({

    name: 'UserHomeCtrl',

    inject: [
      'user',
      'userModel',
      'config',
      'socialNetwork',
      'growl',
      'uploader'
    ],

    data: function() {

      var self = this, uploader = new this.uploader(function(promise) {

        promise.then(function(result) {
          self.user.avatar = {
            url: result.url,
            file: result._id
          };
        }).catch(function(error) {
          self.growl.error(error.response.message, {referenceId: 'avatarError', translateMessage: false});
        });

      }, 'image', 1024 * 1024 * 5);

      return {
        uploader: uploader,
        password: '',
        passwordRepeated: ''
      };

    },

    init: function() {
      this.user.watchForUnsavedChanges();
    }

  });
