'use strict';

angular
  .module('mean.app.directives')
  .directive('passwordRepeat', function(defaultErrorMessageResolver) {

    defaultErrorMessageResolver.getErrorMessages().then(function(errorMessages) {
      errorMessages.passwordRepeat = 'The repeated password does not match.';
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
