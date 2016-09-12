var RemotePlayer = function (index, game, player, startX, startY, startAngle) {
  var x = startX;
  var y = startY;
  var angle = startAngle;

  this.game = game;
  this.health = 3;
  this.player = player;
  this.alive = true;

  this.player = game.add.sprite(x, y, 'robocop');

  this.player.animations.add('right', [0, 1, 2, 3, 4, 5, 6 ,7], 10, true);
  this.player.scale.setTo(1.75, 1.75);

  this.player.anchor.setTo(0.5, 0.5);

  this.player.name = index.toString();

  this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
  this.player.body.gravity.y = 800;
  this.player.body.immovable = false;

  this.player.body.collideWorldBounds = true;

  this.player.tint = 0x0000ff;
  this.player.angle = null;

  this.lastPosition = { x: x, y: y, angle: angle };
};

RemotePlayer.prototype.update = function () {
  if (this.player.x > this.lastPosition.x) {
    this.player.play('right');
    this.player.scale.setTo(1.75, 1.75);
    
  } else if (this.player.x < this.lastPosition.x) {

    this.player.play('right');
    this.player.scale.setTo(- 1.75, 1.75);
  } else {
    this.player.animations.stop();
  }

  this.lastPosition.x = this.player.x;
  this.lastPosition.y = this.player.y;
  this.lastPosition.angle = this.player.angle;
};

window.RemotePlayer = RemotePlayer; 
