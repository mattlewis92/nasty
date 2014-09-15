'use strict';

angular
  .module('mean.app.ctrls')
  .classy
  .controller({

    name: 'AppIndexCtrl',

    inject: ['ResourceFactory'],

    init: function() {

      /*var User = this.ResourceFactory.create({
        name: 'user'
      });

      User.find('current', {}).then(function(user) {
        console.log(user);
        console.log(User.get(user._id));

        user.save().then(function(user) {
          console.log(user);
        });

        user.destroy().then(function(user) {
          console.log(user);
        });
      });*/

    }

  });
