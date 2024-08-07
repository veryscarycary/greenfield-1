angular.module('app.leaderboard', [])

.controller('LeaderboardController', function ($scope, $http) {
	$scope.leaderboard = [];
  	
  $scope.getLeaderboard = function() {
    $http({
      method: 'GET',
      url: `/api/leaderboard`,
    }).then(function(res) {
      console.log('res.data,', res.data)
      var leaderboard = res.data;
      $scope.leaderboard = leaderboard;
      console.log('leaderboard', $scope.leaderboard)
    }, function(err) {
      console.log('error: ', err);
    });
  };

	$scope.getLeaderboard();
});