
var App = {};

angular.module('app', ['ngRoute', 'app.game', 'app.profile', 'app.leaderboard', 'app.signin', 'app.signup'])
.config(function($routeProvider, $locationProvider) {
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
      controller: 'GameController',
      resolve: {
        auth: function(AuthService) {
          return AuthService.checkAuth();
        }
      },
    })
    .when('/profile', {
      templateUrl: './app/profile/profile.html',
      controller: 'ProfileController',
      resolve: {
        auth: function(AuthService) {
          return AuthService.checkAuth();
        }
      },
    })
    .when('/leaderboard', {
      templateUrl: './app/leaderboard/leaderboard.html',
      controller: 'LeaderboardController',
      resolve: {
        auth: function(AuthService) {
          return AuthService.checkAuth();
        }
      },
    })
    .otherwise({
      redirectTo: '/signin'
    });

  // Enable HTML5 mode routing
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
})
.controller('appCtrl', function($scope, $http, $location, $route) {
  $scope.user = {}
  $scope.signinForm = {};
  $scope.signupForm = {};
  
  $scope.$on( "$routeChangeStart", function(event, next, current) {
    console.log('ROUTE CHANGE');

    App.info.removePlayer(App.info.socket);
    App.info.socket.disconnect();
    App.info.game.destroy();
    App.info.game = null;
  });

  $scope.signin = function() {
    $scope.hasLoginError = false;

    $http({
  		method: 'POST',
  		url: '/api/auth/signin',
  		data: $scope.signinForm
  	})
  	.then(function(res){
      $scope.user = res.data;
  		$location.path('/game');
  	})
  	.catch(function(){
      $scope.hasLoginError = true;
  	});

    // $http.post('/auth/login', $scope.user).then(function(response) {
    //   $scope.user = response.data.user;
    //   $location.path('/');
    // });
  };

  $scope.signup = function() {
  	$http({
  		method: 'POST',
  		url: '/api/auth/signup',
  		data: $scope.signupForm
  	})
  	.then(function(){
  		$location.path('/game');
  	})
  	.catch(function(){
  		$location.path('/signin')
  	});
  };
  
  $scope.signout = function() {
    $http({
      method: 'GET',
      url: '/api/auth/signout'
    }).then(function(res) {
      $location.path('signin');
    }, function(err) {
      console.log('error: ', err);
    });
  };
  
  $scope.register = function() {
    $http.post('/api/auth/register', $scope.user).then(function(response) {
      $scope.user = response.data.user;
      $location.path('/');
    });
  };
})
.factory('AuthService', function($http, $q) {
  let isAuthenticated = false;
  let user = null;

  const checkAuth = function() {
    const deferred = $q.defer();

    $http.get('/api/auth/check')
      .then(function(response) {
        if (response.data.isAuthenticated) {
          isAuthenticated = true;
          user = response.data.user; // Assuming `user` is included in the response
          deferred.resolve({ isAuthenticated: true, user: user });
        } else {
          isAuthenticated = false;
          user = null;
          deferred.reject('Not Authenticated');
        }
      })
      .catch(function() {
        isAuthenticated = false;
        user = null;
        deferred.reject('Not Authenticated');
      });

    return deferred.promise;
  };

  return {
    checkAuth: checkAuth,
    isAuthenticated: function() { return isAuthenticated; },
    getSession: function() { return user; }
  };
}).run(function($rootScope, $location, AuthService) {
  $rootScope.$on('$routeChangeError', function(event, current, previous, rejection) {
    if (rejection === 'Not Authenticated') {
      $location.path('/signin');
    }
  });
});