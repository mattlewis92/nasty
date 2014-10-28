'use strict';

angular
  .module('nasty.core.directives')
  .directive('filePicker', function() {
    return {
      restrict: 'EA',
      templateUrl: 'app/core/directives/filePicker/template.html',
      scope: true,
      controller: function($scope) {

        this.setFileText = function(text) {
          $scope.fileText = text;
        }

      }
    };

  });
