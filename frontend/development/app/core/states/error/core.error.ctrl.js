'use strict';

angular
  .module('<%= _.slugify(angularAppName) %>.core.states')
  .classy
  .controller({

    name: 'CoreErrorCtrl',

    inject: ['$location', '$previousState', 'authentication']

  });
