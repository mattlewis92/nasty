'use strict';

angular
  .module('nasty.core.directives')
  .directive('loadingBox', function(loading) {

    return {
      restrict: 'EA',
      transclude: true,
      templateUrl: 'app/core/directives/loadingBox/core.loadingBox.template.html',
      controller: function($scope) {
        $scope.loading = loading;
      }
    };

  });
