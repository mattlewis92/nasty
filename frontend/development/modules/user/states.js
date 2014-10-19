'use strict';

angular
  .module('nasty.user')
  .config(function($stateProvider) {

    $stateProvider
      .state('user', {
        url: '/user',
        abstract: true,
        template: '<ui-view/>'
      })
      .state('user.register', {
        url: '/register',
        templateUrl: 'modules/user/views/register.html',
        controller: 'UserRegisterCtrl as register',
        ifAuth: 'user.home'
      })
      .state('user.login', {
        url: '/login',
        templateUrl: 'modules/user/views/login.html',
        controller: 'UserLoginCtrl as login',
        ifAuth: 'user.home'
      })
      .state('user.resetPasswordRequest', {
        url: '/forgot',
        templateUrl: 'modules/user/views/resetPasswordRequest.html',
        controller: 'UserResetPasswordRequestCtrl as resetPasswordRequest',
        ifAuth: 'user.home'
      })
      .state('user.resetPassword', {
        url: '/forgot/:userId/:resetToken',
        templateUrl: 'modules/user/views/resetPassword.html',
        controller: 'UserResetPasswordCtrl as resetPassword',
        ifAuth: 'user.home'
      })
      .state('user.home', {
        url: '/home',
        templateUrl: 'modules/user/views/home.html',
        controller: 'UserHomeCtrl as home',
        resolve: {
          AuthUser: function(User) {
            return User.getAuthUser();
          }
        }
      });
  });
