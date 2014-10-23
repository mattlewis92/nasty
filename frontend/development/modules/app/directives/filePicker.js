'use strict';

angular
  .module('nasty.app.directives')
  .directive('filePicker', function() {
    return {
      restrict: 'EA',
      templateUrl: 'modules/app/views/directives/filePicker.html',
      scope: true,
      controller: function($scope) {

        this.setFileText = function(text) {
          $scope.fileText = text;
        }

      }
    };

  });
