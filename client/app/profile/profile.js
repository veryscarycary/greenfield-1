angular.module('app.profile', [])

.controller('ProfileController', function ($scope, $http) {
  $scope.user = {};
  $scope.fetchProfile = function() {
    $http({
      method: 'GET',
      url: '/fetchProfile',
      //data: data
    }).then(function(res) {
      var user = res.data;
      //console.log("dataaaaaaaa: ", user);
      $scope.user.name = user.facebook.name;
      $scope.user.highscore = user.local.highscore;
    }, function(err) {
      console.log('error: ', err);
    });
  };

  $scope.fetchProfile();
});

//profile page: 
//high score
//username