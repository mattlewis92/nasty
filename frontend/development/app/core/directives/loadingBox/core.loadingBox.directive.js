'use strict';

angular
  .module('<%= _.slugify(angularAppName) %>.core.directives')
  .directive('loadingBox', function(loading) {

    return {
      restrict: 'EA',
      transclude: true,
      templateUrl: 'app/core/directives/loadingBox/core.loadingBox.html',
      controller: function($scope) {
        $scope.loading = loading;
      }
    };

  });
