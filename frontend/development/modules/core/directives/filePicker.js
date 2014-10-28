'use strict';

angular
  .module('nasty.core.directives')
  .directive('filePicker', function() {
    return {
      restrict: 'EA',
      templateUrl: 'modules/core/views/directives/filePicker.html',
      scope: true,
      controller: function($scope) {

        this.setFileText = function(text) {
          $scope.fileText = text;
        }

      }
    };

  });
