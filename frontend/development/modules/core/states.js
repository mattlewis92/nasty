'use strict';

angular
  .module('nasty.core')
  .config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('index', {
        url: '/',
        controller: 'AppIndexCtrl as index',
        templateUrl: 'modules/core/views/index.html'
      })
      .state('404', {
        url: '/404',
        controller: 'App404Ctrl as errorCtrl',
        templateUrl: 'modules/core/views/404.html'
      });

    $urlRouterProvider.otherwise('/404');

  });
