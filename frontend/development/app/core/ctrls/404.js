'use strict';

angular
  .module('nasty.core.ctrls')
  .classy
  .controller({

    name: 'App404Ctrl',

    inject: ['historyManager', 'authentication']

  });
