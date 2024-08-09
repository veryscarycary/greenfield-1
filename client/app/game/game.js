angular.module('app.game', [])

.controller('GameController', function ($scope, $window, auth) {
	$scope.user = auth.user;
	$window.load = false;

	if (!$window.load) {
		$('#game')
		.append('<script src="../../stages/stage0/stage0.js"></script>')
		.append('<script src="../../stages/stage1/stage1.js"></script>')
		.append('<script src="../../stages/stage1/otherPlayer1.js"></script>')
		.append('<script src="../../stages/stage5/stage5.js"></script>')
		.append('<script src="../../stages/stage4/stage4.js"></script>')
		.append('<script src="../../stages/stage3/stage3.js"></script>')
		.append('<script src="../../stages/stage2/stage2.js"></script>')
		.append('<script src="../../stages/store/store.js"></script>')

		.append('<script src="../../stages/start.js"></script>');

		console.log("load: ", $window.load);
	}

});