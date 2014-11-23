'use strict';

angular
  .module('<%= _.slugify(angularAppName) %>.user.directives')
  .directive('passwordRepeat', function(defaultErrorMessageResolver, $translate) {

    var msg;
    $translate('REPEATED_PASSWORD_DOES_NOT_MATCH').then(function(str) {

      msg = str;
      return defaultErrorMessageResolver.getErrorMessages();

    }).then(function(errorMessages) {

      errorMessages.passwordRepeat = msg;

    });

    return {
      restrict: 'A',
      require: 'ngModel',
      scope: {
        passwordRepeat: '='
      },
      link: function(scope, elm, attrs, ctrl) {

        var validateFn = function(viewValue) {
          if (viewValue !== scope.passwordRepeat) {
            ctrl.$setValidity('passwordRepeat', false);
            return undefined;
          } else {
            ctrl.$setValidity('passwordRepeat', true);
            return viewValue;
          }
        };

        ctrl.$parsers.push(validateFn);
        ctrl.$formatters.push(validateFn);
      }
    };

  });
