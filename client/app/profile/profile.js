angular.module('app.profile', [])

.controller('ProfileController', function ($scope, $http, auth) {
  $scope.user = auth.user;

  $scope.updateHighscore = function(score) {
    $http({
      method: 'PUT',
      url: `/api/users/${$scope.user.username}/highscore`,
      data: { highscore: score }, 
    }).then(function(res) {
      var user = res.data;
      //console.log("dataaaaaaaa: ", user);
      $scope.user.highscore = user.highscore;

      console.log('USER: ', user);
    }, function(err) {
      console.log('error: ', err);
    });
  };
});

//profile page: 
//high score
//username