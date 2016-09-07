var App = {};

App.stage1 = function(game) {
  console.log("starting stage1");
};

App.stage1.prototype = {
  preload: function() {
    this.load.spritesheet('dude', '/../../../assets/dude.png', 32, 48);
    this.load.image('ground','/../../../assets/platform.png');
  },

  create: function() {
    this.physics.startSystem(Phaser.Physics.ARCADE);
    platforms = this.add.group();
    platforms.enableBody = true;
    var ground = platforms.create(0, this.world.height - 64, 'ground');
    ground.scale.setTo(2, 2);
    ground.body.immovable = true;
    player = this.add.sprite(32, this.world.height - 150, 'dude');
    this.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;
    player.body.gravity.y = 300;
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);
    scoreText = this.add.text(16, 16, 'score: 0', {fontSize: '32px', fill: '#fff'});

    

  },

  update: function() {
    var cursors = this.input.keyboard.createCursorKeys();
    player.body.velocity.x = 0;
    this.physics.arcade.collide(player, platforms);
    

    if (cursors.left.isDown) {
      player.body.velocity.x = -150;
      player.animations.play('left');
    } else if (cursors.right.isDown) {
      player.body.velocity.x = 150;
      player.animations.play('right');
    } else {
      player.animations.stop();
      player.frame = 4;

    }
    if (cursors.down.isDown) {
      this.state.start("stage2");
    }
    if (cursors.up.isDown) {
      App.info.score += 10;
      scoreText.text = 'Score:' + App.info.score;
      console.log(this);
    }
    this.socketCheck(App.info.socket, this);


  },

  socketCheck: function(socket, context) {

    socket.on('makePlayer', function(counter) {
      console.log(this);
      counter = context.add.sprite(32, context.world.height - 150, 'dude');
      context.physics.arcade.enable(counter);
      context.physics.arcade.enable(counter);
      counter.body.collideWorldBounds = true;

      counter.body.gravity.y = 300;
    });
  }
}; 

App.info = {
  score: 0,
  life: 0,
  socket: io.connect('http://localhost:3000')
};