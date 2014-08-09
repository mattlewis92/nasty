'use strict';

angular
  .module('mean.app.directives')
  .directive('loadingBtn', function() {
    return {
      restrict: 'A',
      scope: {
        tracker: '=loadingBtn'
      },
      link: function(scope, elm) {

        var originalHtml = elm.html();

        scope.$watch(scope.tracker.active, function(isActive) {

          if (isActive) {
            elm.attr('disabled', 'disabled');
            elm.html('<i class="fa fa-spin fa-spinner"></i> Loading...');
          } else {
            elm.removeAttr('disabled');
            elm.html(originalHtml);
          }

        });

      }
    };

  });
