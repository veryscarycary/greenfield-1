angular.module('app.leaderboard', [])

.controller('LeaderboardController', function ($scope, $http) {
  	
  	$scope.leaderboard = [{player: 'one', highscore: 10000}, {player: 'two', highscore: 2000}, {player: 'three', highscore: 60000}];
  	
  	// $http({
  	// 	method: 'GET',
  	// 	url: //tbd
  	// })
  	// .then(function(leaderboard) {
  	// 	$scope.leaderboard = leaderboard.data;
  	// })
  	// .catch(function(err) {
  	// 	console.log('Error occured: ', err);
  	// });
});