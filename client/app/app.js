
angular.module('app', ['ngRoute', 'app.game', 'app.profile', 'app.leaderboard'])
.config(function($routeProvider) {
  $routeProvider
    // .when('/signin', {
    //   templateUrl: './app/signin/signin.html',
    //   Controller: 'SigninController'
    // })
    // .when('/signup', {
    //   templateUrl: './app/signup/signup.html',
    //   Controller: 'SignupController'
    // })

    .when('/game', {
      templateUrl: './app/game/game.html',
      controller: 'GameController'
    })
    .when('/profile', {
      templateUrl: './app/profile/profile.html',
      controller: 'ProfileController'

    })
    .when('/leaderboard', {
      templateUrl: './app/leaderboard/leaderboard.html',
      controller: 'LeaderboardController'
    })
    .otherwise({
      redirectTo: '/profile'
    });
});