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

angular
  .module('angular-growl')
  .config(function($provide) {

    $provide.decorator('growlDirective', function($delegate) {
      var directive = $delegate[0];
      directive.restrict = 'EA';
      return $delegate;
    });

  }).run(function($rootScope, growl, growlMessages) {

    //Stop a directive overwriting messages if set before
    growlMessages.initDirective = function(referenceId, limitMessages) {

      if (!growlMessages.directives[referenceId]) {
        growlMessages.directives[referenceId] = {
          messages: [],
          limitMessages: limitMessages
        };
      }
    };

    //Allow calls to flash messages if the directive doesn't exist
    ['info', 'success', 'error', 'warning'].forEach(function(messageType) {

      var originalFunc = growl[messageType];
      growl[messageType] = function(text, config) {
        if (config && config.referenceId && !growlMessages.directives[config.referenceId]) {
          growlMessages.directives[config.referenceId] = {
            messages: []
          };
        }
        return originalFunc(text, config);
      };

    });

    //Make growl function much like flash and remove messages on route change start
    $rootScope.$on('$stateChangeStart', function() {
      angular.forEach(growlMessages.directives, function(value, key) {
        if (key !== '0') { //Allow floating messages to stick
          value.messages = [];
        }
      });
    });

  });
