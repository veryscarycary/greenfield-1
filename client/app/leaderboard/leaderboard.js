angular.module('app.leaderboard', [])

.controller('LeaderboardController', function ($scope, $http) {
	$scope.leaderboard = [];
  	
  $scope.getLeaderboard = function() {
    $http({
      method: 'GET',
      url: `/api/leaderboard`,
    }).then(function(res) {
      var leaderboard = res.data;
      $scope.leaderboard = leaderboard;
    }, function(err) {
      console.log('error: ', err);
    });
  };

	$scope.getLeaderboard();
});