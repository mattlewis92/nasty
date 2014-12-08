'use strict';

angular
  .module('nasty.core.states')
  .classy
  .controller({

    name: 'CoreErrorCtrl',

    inject: ['$location', '$previousState', 'authentication']

  });
