angular.module('app.signup', [])

.controller('SignupController', function ($scope, $http, $location) {
  
}).directive('signUp', function() {
	console.log('inside directive');
	return {
		restrict: 'E',
		templateUrl: './app/signup/signup.html',
		controller: 'SignupController'
	};
});