angular.module('app.profile', [])

.controller('ProfileController', function ($scope, $http) {
  $scope.user = {};
  $scope.user.highscore = 500;
  $scope.fetchProfile = function() {
    $http({
      method: 'GET',
      url: '/fetchProfile',
      //data: data
    }).then(function(res) {
      var user = res.data.facebook;
      console.log("dataaaaaaaa: ", user);
      $scope.user.name = user.name;
      //update highscore here
    }, function(err) {
      console.log('error: ', err);
    });
  };

  $scope.fetchProfile();
});

//profile page: 
//high score
//username