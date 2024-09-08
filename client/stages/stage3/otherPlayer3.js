var RemotePlayer = function (index, game, player, startX, startY, startAngle) {
  var x = startX;
  var y = startY;
  var angle = startAngle;

  this.game = game;
  this.health = 100;
  this.player = player;
  this.alive = true;

  this.player = game.add.sprite(x, y, 'redLink');

  this.player.animations.add('right', [0, 1], 16, true);
  this.player.animations.add('up', [4, 5], 16, true);
  this.player.animations.add('left', [8, 9], 16, true);
  this.player.animations.add('down', [12, 13], 16, true);
  this.player.animations.add('stand', [12], 16, true);


  this.player.anchor.setTo(0.5, 0.5);

  this.player.name = index.toString();
  this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
  this.player.body.immovable = true;
  this.player.body.collideWorldBounds = true;

  // this.player.angle = angle;

  this.lastPosition = { x: x, y: y };
};

RemotePlayer.prototype.update = function () {
  if (this.player.x < this.lastPosition.x) {
    this.player.animations.play('left');
    // this.player.rotation = Math.PI + this.game.physics.arcade.angleToXY(this.player, this.lastPosition.x, this.lastPosition.y);
  } else if (this.player.x > this.lastPosition.x) {
    this.player.animations.play('right');
  } else if (this.player.y < this.lastPosition.y) {
    this.player.animations.play('up');
  } else if (this.player.y < this.lastPosition.y) {
    this.player.animations.play('down');
  } else {
    this.player.animations.play('stand');
  }

  this.lastPosition.x = this.player.x;
  this.lastPosition.y = this.player.y;
  // this.lastPosition.angle = this.player.angle;
};

window.RemotePlayer = RemotePlayer;
