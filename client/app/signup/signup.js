angular.module('app.signup', [])

.controller('SignupController', function ($scope, $http, $location) {
  
	$scope.user = {};

  $scope.signup = function() {
  	$http({
  		method: 'POST',
  		url: '/signup',
  		data: $scope.user
  	})
  	.then(function(){
  		$location.path('/menu');
  	})
  	.catch(function(){
  		$location.path('/signin')
  	});
  };

});