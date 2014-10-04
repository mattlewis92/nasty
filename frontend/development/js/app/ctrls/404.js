'use strict';

angular
  .module('mean.app.ctrls')
  .classy
  .controller({

    name: 'App404Ctrl',

    inject: ['HistoryManager', 'Authentication']

  });
