'use strict';

angular
  .module('ui.checkbox')
  .config(function($provide) {

    $provide.decorator('checkboxDirective', function($delegate) {
      var directive = $delegate[0];

      directive.restrict = 'EA';
      directive.template = [
        '<button type="button" ng-style="stylebtn" class="btn btn-default no-outline"',
        'ng-class="{\'btn-xs\': size===\'default\', \'btn-sm\': size===\'large\', \'btn-lg\': size===\'largest\'}">',
        '<span ng-style="styleicon" class="fa" ng-class="{\'fa-check\': checked===true}"></span>',
        '</button>'
      ].join('\n');

      return $delegate;
    });

});
