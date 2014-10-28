'use strict';

angular
  .module('nasty.core.routes')
  .config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('index', {
        url: '/',
        controller: 'CoreIndexCtrl as index',
        templateUrl: 'app/core/routes/index/template.html'
      })
      .state('404', {
        url: '/404',
        controller: 'Core404Ctrl as errorCtrl',
        templateUrl: 'app/core/routes/404/template.html'
      });

    $urlRouterProvider.otherwise('/404');

  });
