angular.module('app.signup', [])

.controller('SignupController', function ($scope, $http, $location) {
  $scope.checkKeyPress = function(event) {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();  // Prevent form submission or space scrolling
      $scope.signup();  // Trigger button click
    }
  };
});