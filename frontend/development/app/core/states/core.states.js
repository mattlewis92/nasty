'use strict';

angular
  .module('<%= _.slugify(angularAppName) %>.core.states')
  .config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('index', {
        url: '/',
        controller: 'CoreIndexCtrl as indexCtrl',
        templateUrl: 'app/core/states/index/core.index.html'
      })
      .state('error', {
        url: '/error',
        controller: 'CoreErrorCtrl as errorCtrl',
        templateUrl: 'app/core/states/error/core.error.html'
      });

    $urlRouterProvider.otherwise('/error?code=404');

  });
