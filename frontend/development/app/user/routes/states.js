'use strict';

angular
  .module('nasty.user.routes')
  .config(function($stateProvider) {

    $stateProvider
      .state('user', {
        url: '/user',
        abstract: true,
        template: '<ui-view/>'
      })
      .state('user.register', {
        url: '/register',
        templateUrl: 'app/user/routes/register/template.html',
        controller: 'UserRegisterCtrl as register',
        ifAuth: 'user.home'
      })
      .state('user.login', {
        url: '/login',
        templateUrl: 'app/user/routes/login/template.html',
        controller: 'UserLoginCtrl as login',
        ifAuth: 'user.home'
      })
      .state('user.resetPasswordRequest', {
        url: '/forgot',
        templateUrl: 'app/user/routes/resetPasswordRequest/template.html',
        controller: 'UserResetPasswordRequestCtrl as resetPasswordRequest',
        ifAuth: 'user.home'
      })
      .state('user.resetPassword', {
        url: '/forgot/:userId/:resetToken',
        templateUrl: 'app/user/routes/resetPassword/template.html',
        controller: 'UserResetPasswordCtrl as resetPassword',
        ifAuth: 'user.home'
      })
      .state('user.home', {
        url: '/home',
        templateUrl: 'app/user/routes/home/template.html',
        controller: 'UserHomeCtrl as home',
        resolve: {
          authUser: function(user) {
            return user.getAuthUser();
          }
        }
      });
  });
