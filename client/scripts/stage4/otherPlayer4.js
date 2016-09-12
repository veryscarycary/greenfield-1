var RemotePlayer = function (index, game, player, startX, startY, startAngle) {
  var x = startX;
  var y = startY;
  var angle = startAngle;

  this.game = game;
  this.health = 3;
  this.player = player;
  this.alive = true;

  this.player = game.add.sprite(x, y, 'dude');

  this.player.animations.add('left', [0, 1, 2, 3], 10, true);
  this.player.animations.add('right', [5, 6, 7, 8], 10, true);

  this.player.anchor.setTo(0.5, 0.5);

  this.player.name = index.toString();
  this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
  this.player.body.immovable = true;
  this.player.body.collideWorldBounds = true;

  this.player.angle = angle;

  this.lastPosition = { x: x, y: y, angle: angle };
};

RemotePlayer.prototype.update = function () {
  if (this.player.x !== this.lastPosition.x || this.player.y !== this.lastPosition.y || this.player.angle !== this.lastPosition.angle) {
    this.player.play('left');
    // this.player.rotation = Math.PI + this.game.physics.arcade.angleToXY(this.player, this.lastPosition.x, this.lastPosition.y);
  } else {
    this.player.play('right');
  }

  this.lastPosition.x = this.player.x;
  this.lastPosition.y = this.player.y;
  this.lastPosition.angle = this.player.angle;
};

window.RemotePlayer;
