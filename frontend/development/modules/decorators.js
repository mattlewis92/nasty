'use strict';

angular
  .module('ui.checkbox')
  .config(function($provide) {

    $provide.decorator('checkboxDirective', function($delegate) {
      var directive = $delegate[0];
      directive.restrict = 'EA';
      directive.template = "<button type=\"button\" ng-style=\"stylebtn\" class=\"btn btn-default no-outline\" ng-class=\"{'btn-xs': size==='default', 'btn-sm': size==='large', 'btn-lg': size==='largest'}\">" +
        "<span ng-style=\"styleicon\" class=\"fa\" ng-class=\"{'fa-check': checked===true}\"></span>" +
        "</button>";
      return $delegate;
    });

});

angular
  .module('nasty')
  .config(function($provide, Bluebird) {

    //Make bluebird API compatible with angular's subset of $q
    function bind(fn, ctx) {
      return function() {
        return fn.apply(ctx, arguments);
      };
    }

    Bluebird.defer = function() {
      var b = Bluebird.pending();
      b.resolve = bind(b.fulfill, b);
      b.reject = bind(b.reject, b);
      b.notify = bind(b.progress, b);
      return b;
    };

    Bluebird.reject = Bluebird.rejected;

    Bluebird.when = function(a) {
      return Bluebird.cast(a);
    };

    Bluebird.onPossiblyUnhandledRejection(angular.noop);

    $provide.decorator('$q', function() {
      return Bluebird;
    });

  });
