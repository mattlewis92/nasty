'use strict';

angular
  .module('mean.app')
  .config(function($locationProvider) {

    $locationProvider.html5Mode(true);

  })
  .config(function(RestangularProvider) {

    RestangularProvider.setBaseUrl('/api/v1');

    RestangularProvider.setRestangularFields({
      id: '_id'
    });

  });
