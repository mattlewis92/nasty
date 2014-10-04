'use strict';

angular
  .module('mean.app')
  .config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('index', {
        url: '/',
        controller: 'AppIndexCtrl as index',
        templateUrl: 'views/app/index.html'
      })
      .state('404', {
        url: '/404',
        controller: 'App404Ctrl as errorCtrl',
        templateUrl: 'views/app/404.html'
      });

    $urlRouterProvider.otherwise('/404');

  });
