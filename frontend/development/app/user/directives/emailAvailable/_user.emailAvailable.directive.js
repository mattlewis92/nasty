'use strict';

angular
  .module('<%= _.slugify(angularAppName) %>.user.directives')
  .directive('emailAvailable', function(defaultErrorMessageResolver, $translate, API) {

    var msg;
    $translate('EMAIL_ADDRESS_TAKEN').then(function(str) {

      msg = str;
      return defaultErrorMessageResolver.getErrorMessages();

    }).then(function(errorMessages) {

      errorMessages.emailAvailable = msg;

    });

    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, elm, attrs, ctrl) {

        ctrl.$asyncValidators.emailAvailable = function(email) {
          return API.get('user/email_check?email=' + email, {autoError: false});
        };
      }
    };

  });
