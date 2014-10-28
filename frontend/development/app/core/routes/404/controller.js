'use strict';

angular
  .module('nasty.core.routes')
  .classy
  .controller({

    name: 'App404Ctrl',

    inject: ['historyManager', 'authentication']

  });
