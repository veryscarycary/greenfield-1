angular.module('app.signin', [])

.controller('SigninController', function ($scope, $http, $location) {

}).directive('signIn', function() {
	console.log('inside directive');
	return {
		restrict: 'E',
		templateUrl: './app/signin/signin.html',
		controller: 'SigninController'
	};
});