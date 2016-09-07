angular.module('app', ['ngRoute'])
.config(function($routeProvider) {
  $routeProvider
    .when('/signin', {
      templateUrl: './app/signin/signin.html',
      Controller: 'SigninController'
    })
    .when('/signup', {
      templateUrl: './app/signup/signup.html',
      Controller: 'SignupController'
    })
    .when('/game', {
      templateUrl: './app/game/game.html',
      Controller: 'GameController'
    })
    .when('/menu', {
      templateUrl: './app/menu/menu.html',
      Controller: 'MenuController'
    })
    .when('/leaderboard', {
      templateUrl: './app/leaderboard/leaderboard.html',
      Controller: 'LeaderboardController'
    })
    .otherwise({
      redirectTo: '/signin'
    });
});