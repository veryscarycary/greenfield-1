
var App = {};

angular.module('app', ['ngRoute', 'app.game', 'app.profile', 'app.leaderboard', 'app.signin'])
.config(function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/signup', {
      templateUrl: './app/signup/signup.html',
      Controller: 'SignupController'
    })
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
      redirectTo: '/'
    });

  // Enable HTML5 mode routing
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
})
.controller('appCtrl', function($scope, $http, $location, $route) {
  $scope.isLoggedIn = false;
  
  // Watch for changes to isLoggedIn
  $scope.$watch('isLoggedIn', function(newVal, oldVal) {
    if (newVal) {
      // Redirect to game page if logged in
      $location.path('/game');
    }
  });

  $scope.$on( "$routeChangeStart", function(event, next, current) {
    console.log('ROUTE CHANGE');

    // TODO - CHECK ON THIS CODE TO SEE IF IT WORKS
    // App.info.removePlayer(App.info.socket);
    // App.info.socket.disconnect();
  });

  $scope.login = function() {
    $scope.isLoggedIn = true;
    // $http.post('/auth/login', $scope.user).then(function(response) {
    //   $scope.user = response.data.user;
    //   $location.path('/');
    // });
  };
  
  $scope.signout = function() {
    $scope.isLoggedIn = false;
    // $http({
    //   method: 'GET',
    //   url: '/signout'
    // }).then(function(res) {
    //   $http({
    //     method: 'GET',
    //     url: '/'
    //   });
    // }, function(err) {
    //   console.log('error: ', err);
    // });
  };
  
  $scope.register = function() {
    $http.post('/auth/register', $scope.user).then(function(response) {
      $scope.user = response.data.user;
      $location.path('/');
    });
  };
});