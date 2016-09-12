angular.module('app.game', [])

.controller('GameController', function ($scope, $window) {
	$window.load = false;

	if (!$window.load) {
		$('#game')
		.append('<script src="../../scripts/stage1/stage1.js"></script>')
		.append('<script src="../../scripts/stage1/otherPlayer1.js"></script>')
		.append('<script src="../../scripts/stage5/stage5.js"></script>')
		.append('<script src="../../scripts/stage4/stage4.js"></script>')
		.append('<script src="../../scripts/stage3/stage3.js"></script>')
		.append('<script src="../../scripts/stage2/stage2.js"></script>')
		.append('<script src="../../scripts/start.js"></script>');

		console.log("load: ", $window.load);
	} else {

	}

});