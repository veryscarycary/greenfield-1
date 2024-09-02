angular.module('app.game', [])
.controller('GameController', function ($scope, $http, auth) {
  $scope.user = auth.user;

  $scope.updateHighscore = function(score) {
    $http({
      method: 'PUT',
      url: `/api/users/${$scope.user.username}/highscore`,
      data: { highscore: score }, 
    }).then(function(res) {
      var user = res.data;
      $scope.user.highscore = user.highscore;
    }, function(err) {
      console.log('Error updating highscore: ', err);
    });
  };

  $scope.getUser = function() {
    if (!$scope.user) {
      console.error('Error: Could not getUser.')
      return;
    }

    return $http.get(`/api/users/${$scope.user.username}`).then(function(res) {
      var user = res.data;
      return user;
    }, function(err) {
      console.log('error: ', err);
    });
  };
});