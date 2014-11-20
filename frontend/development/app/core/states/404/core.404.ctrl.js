'use strict';

angular
  .module('nasty.core.states')
  .classy
  .controller({

    name: 'Core404Ctrl',

    inject: ['$previousState', 'authentication']

  });
