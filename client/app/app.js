angular.module('app', ['ngRoute', 'app.game', 'app.leaderboard', 'app.menu', 'app.signin', 'app.signup'])
.config(function($routeProvider) {
  $routeProvider
    .when('/signin', {
      templateUrl: './app/signin/signin.html',
      controller: 'SigninController'
    })
    .when('/signup', {
      templateUrl: './app/signup/signup.html',
      controller: 'SignupController'
    })
    .when('/game', {
      templateUrl: './app/game/game.html',
      controller: 'GameController'
    })
    .when('/menu', {
      templateUrl: './app/menu/menu.html',
      controller: 'MenuController'
    })
    .when('/leaderboard', {
      templateUrl: './app/leaderboard/leaderboard.html',
      controller: 'LeaderboardController'
    })
    .otherwise({
      redirectTo: '/signin'
    });
});