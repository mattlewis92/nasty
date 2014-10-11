'use strict';

angular
  .module('mean.app')
  .config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('index', {
        url: '/',
        controller: 'AppIndexCtrl as index',
        templateUrl: 'modules/app/views/index.html'
      })
      .state('404', {
        url: '/404',
        controller: 'App404Ctrl as errorCtrl',
        templateUrl: 'modules/app/views/404.html'
      });

    $urlRouterProvider.otherwise('/404');

  });
