'use strict';

angular
  .module('<%= _.slugify(angularAppName) %>.core.directives')
  .directive('navbar', function() {

    return {
      restrict: 'EA',
      templateUrl: 'app/core/directives/navbar/core.navbar.html',
      controller: 'CoreNavbarCtrl',
      controllerAs: 'navbar'
    };

  });
