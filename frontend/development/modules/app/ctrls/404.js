'use strict';

angular
  .module('nasty.app.ctrls')
  .classy
  .controller({

    name: 'App404Ctrl',

    inject: ['historyManager', 'authentication']

  });
