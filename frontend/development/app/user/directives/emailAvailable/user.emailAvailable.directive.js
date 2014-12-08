'use strict';

angular
  .module('<%= _.slugify(angularAppName) %>.user.directives')
  .directive('emailAvailable', function(defaultErrorMessageResolver, $translate, userModel, authentication) {

    var msg;
    $translate('EMAIL_ADDRESS_TAKEN').then(function(str) {

      msg = str;
      return defaultErrorMessageResolver.getErrorMessages();

    }).then(function(errorMessages) {

      errorMessages.emailAvailable = msg;

    });

    function emailCheck(email, currentUserId) {
      return userModel.doGET('email_check?email=' + email + (currentUserId ? '&current_user_id=' + currentUserId : ''), {autoError: false});
    }

    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, elm, attrs, ctrl) {

        ctrl.$asyncValidators.emailAvailable = function(email) {

          //If we are checking the email from the profile edit page
          if (authentication.isAuthenticated()) {

            return userModel.getAuthUser().then(function(user) {
              return emailCheck(email, user._id);
            });

          } else { //if we are checking from the user registration page
            return emailCheck(email);
          }

        };

      }
    };

  });
