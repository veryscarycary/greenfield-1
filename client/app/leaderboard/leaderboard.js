angular.module('app.leaderboard', [])

.controller('LeaderboardController', function ($scope, $http) {
  	
  	$scope.leaderboard = [];
  	
  	$http({
  		method: 'GET',
  		url: //tbd
  	})
  	.then(function(leaderboard) {
  		$scope.leaderboard = leaderboard.data;
  	})
  	.catch(function(err) {
  		console.log('Error occured: ', err);
  	});
});