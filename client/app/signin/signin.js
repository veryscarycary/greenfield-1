angular.module('app.signin', [])

.controller('SigninController', function ($scope, $http, $location) {
  $scope.checkKeyPress = function(event) {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();  // Prevent form submission or space scrolling
      $scope.signin();  // Trigger button click
    }
  };
});