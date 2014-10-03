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
      .state('user.resetPasswordRequest', {
        url: '/forgot',
        templateUrl: 'views/user/resetPasswordRequest.html',
        controller: 'UserResetPasswordRequestCtrl as resetPasswordRequest',
        ifAuth: 'user.home'
      })
      .state('user.resetPassword', {
        url: '/forgot/:userId/:resetToken',
        templateUrl: 'views/user/resetPassword.html',
        controller: 'UserResetPasswordCtrl as resetPassword',
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
