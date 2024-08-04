angular.module('app.signin', [])

.controller('SigninController', function ($scope, $http, $location) {
  
  $scope.user = {};

  $scope.signin = function() {
  	$http({
  		method: 'POST',
  		url: '/signin',
  		data: $scope.user
  	})
  	.then(function(){
  		$location.path('/menu');
  	})
  	.catch(function(){
  		$location.path('/signin')
  	});
  };

}).directive('signIn', function() {
	console.log('inside directive');
	return {
		restrict: 'E',
		templateUrl: './app/signin/signin.html',
		controller: 'SigninController'
	};
});