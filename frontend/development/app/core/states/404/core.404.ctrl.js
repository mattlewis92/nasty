'use strict';

angular
  .module('nasty.core.routes')
  .classy
  .controller({

    name: 'Core404Ctrl',

    inject: ['$previousState', 'authentication']

  });
