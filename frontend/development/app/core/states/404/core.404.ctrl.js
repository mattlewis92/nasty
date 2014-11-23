'use strict';

angular
  .module('<%= _.slugify(angularAppName) %>.core.states')
  .classy
  .controller({

    name: 'Core404Ctrl',

    inject: ['$previousState', 'authentication']

  });
