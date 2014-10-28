'use strict';

angular
  .module('nasty.core.directives')
  .directive('fileInput', function() {
    return {
      restrict: 'A',
      scope: true,
      require: '^filePicker',
      link: function(scope, elm, attrs, filePickerCtrl) {

        elm.bind('change', function() {
          if (elm[0].value) {
            var filename = elm[0].value.split('\\').pop();
            filePickerCtrl.setFileText(filename);
            scope.$apply();
          }
        });

      }
    };

  });
