'use strict';

angular
  .module('mean.user')
  .config(function($stateProvider) {

    $stateProvider
      .state('user', {
        url: '/user',
        abstract: true,
        template: '<ui-view/>'
      })
      .state('user.register', {
        url: '/register',
        templateUrl: 'views/user/register.html',
        controller: 'UserRegisterCtrl as register',
        ifAuth: 'user.home'
      })
      .state('user.login', {
        url: '/login',
        templateUrl: 'views/user/login.html',
        controller: 'UserLoginCtrl as login',
        ifAuth: 'user.home'
      })
      .state('user.forgotPassword', {
        url: '/forgot',
        templateUrl: 'views/user/forgotPassword.html',
        controller: 'UserResetPasswordCtrl as forgotPassword',
        ifAuth: 'user.home'
      })
      .state('user.home', {
        url: '/home',
        templateUrl: 'views/user/home.html',
        controller: 'UserHomeCtrl as home',
        resolve: {
          AuthUser: function(User) {
            return User.getAuthUser();
          }
        }
      });
  });
