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
      .state('404', {
        url: '/404',
        controller: 'Core404Ctrl as errorCtrl',
        templateUrl: 'app/core/states/404/core.404.html'
      });

    $urlRouterProvider.otherwise('/404');

  });
