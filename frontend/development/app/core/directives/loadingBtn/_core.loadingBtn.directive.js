'use strict';

angular
  .module('<%= _.slugify(angularAppName) %>.core.directives')
  .directive('loadingBtn', function($translate) {
    return {
      restrict: 'A',
      scope: {
        tracker: '=loadingBtn',
        isDisabled: '=ngDisabled'
      },
      link: function(scope, elm) {

        var originalHtml = elm.html(), firstRun = true, loadingText = '';

        $translate('LOADING').then(function(str) {
          loadingText = str;
        });

        scope.$watch(scope.tracker.active, function(isActive) {

          if (firstRun) {
            if (!isActive) {
              firstRun = false;
            }
            return;
          }

          if (isActive) {
            elm.attr('disabled', 'disabled');
            originalHtml = elm.html();
            elm.html('<i class="fa fa-spin fa-spinner"></i> ' + loadingText + '&hellip;');
          } else {
            if (!scope.isDisabled) {
              elm.removeAttr('disabled');
            }
            elm.html(originalHtml);
          }

        });

      }
    };

  });
