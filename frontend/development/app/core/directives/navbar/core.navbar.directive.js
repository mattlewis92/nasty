'use strict';

angular
  .module('nasty.core.directives')
  .directive('navbar', function() {

    return {
      restrict: 'EA',
      templateUrl: 'app/core/directives/navbar/core.navbar.template.html',
      controller: 'CoreNavbarCtrl',
      controllerAs: 'navbar'
    };

  });