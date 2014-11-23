'use strict';

angular
  .module('<%= _.slugify(angularAppName) %>.user.states')
  .config(function($stateProvider) {

    $stateProvider
      .state('user', {
        url: '/user',
        abstract: true,
        template: '<ui-view/>'
      })
      .state('user.register', {
        url: '/register',
        templateUrl: 'app/user/states/register/user.register.template.html',
        controller: 'UserRegisterCtrl as register',
        ifAuth: 'user.home'
      })
      .state('user.login', {
        url: '/login',
        templateUrl: 'app/user/states/login/user.login.template.html',
        controller: 'UserLoginCtrl as login',
        ifAuth: 'user.home'
      })
      .state('user.resetPasswordRequest', {
        url: '/forgot',
        templateUrl: 'app/user/states/resetPasswordRequest/user.resetPasswordRequest.template.html',
        controller: 'UserResetPasswordRequestCtrl as resetPasswordRequest',
        ifAuth: 'user.home'
      })
      .state('user.resetPassword', {
        url: '/forgot/:userId/:resetToken',
        templateUrl: 'app/user/states/resetPassword/user.resetPassword.template.html',
        controller: 'UserResetPasswordCtrl as resetPassword',
        ifAuth: 'user.home'
      })
      .state('user.home', {
        url: '/home',
        templateUrl: 'app/user/states/home/user.home.template.html',
        controller: 'UserHomeCtrl as home',
        resolve: {
          authUser: function(user) {
            return user.getAuthUser();
          }
        }
      });
  });
