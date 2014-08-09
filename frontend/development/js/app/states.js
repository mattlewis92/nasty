'use strict';

angular
  .module('mean.app')
  .config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('index', {
        url: '/',
        controller: 'AppIndexCtrl',
        templateUrl: 'views/app/index.html'
      });
  });
