'use strict';

angular
  .module('<%= _.slugify(angularAppName) %>.core.directives')
  .directive('filePicker', function() {
    return {
      restrict: 'EA',
      templateUrl: 'app/core/directives/filePicker/core.filePicker.template.html',
      scope: {
        uploader: '=',
        onSave: '&'
      },
      controller: function($scope) {

        this.setFileText = function(text) {
          $scope.fileText = text;
        };

        $scope.save = function() {
          $scope.fileText = null;
          $scope.onSave();
        };

      }
    };

  });
