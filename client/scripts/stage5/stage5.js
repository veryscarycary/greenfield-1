App.stage5 = function(game) {
  console.log("starting stage5");
  App.info.game = game;

};

App.stage5.prototype = {
  preload: function() {
    this.load.spritesheet('dude', '/../../../assets/dude.png', 32, 48);
    this.load.image('background', '/../../../assets/space.png');
    this.load.spritesheet('coin','/../../../assets/coin.png', 32, 32);
    // this.load.image('ground', '/../../../assets/platform.png');
    this.load.script('otherPlayer5', '/scripts/stage5/otherPlayer5.js');
  },

  create: function() {
    
    this.physics.startSystem(Phaser.Physics.P2JS);

    this.physics.p2.setImpactEvents(true);

    this.physics.p2.restitution = 0.5;

    this.add.tileSprite(0, 0, 800, 600, 'background');

    this.physics.p2.updateBoundsCollisionGroup();
    var coinGroup = this.physics.p2.createCollisionGroup();
    App.info.playerGroup = this.physics.p2.createCollisionGroup();

    // platforms = this.add.group();
    // platforms.enableBody = true;
    // var ground = platforms.create(0, this.world.height - 64, 'ground');
    // ground.scale.setTo(2, 2);
    // ground.body.immovable = true;
    for (var i = 0; i < 30; i++) {
    
    coin = this.add.sprite(this.world.randomX, this.world.randomX, 'coin');
    coin.animations.add('bling', [0, 1, 2, 3, 4, 5, 6, 7, 8], 10, true);
    this.physics.p2.enable(coin, false);
    coin.body.setCircle(15);
    coin.animations.play('bling');  
    coin.body.setCollisionGroup(coinGroup);
    coin.body.collides([App.info.playerGroup, coinGroup]);

    }

    player = this.add.sprite(200, this.world.height - 150, 'dude');

    this.physics.p2.enable(player, false);
    player.body.setCircle(15);

    // this.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;
    player.body.setCollisionGroup(App.info.playerGroup);

    // player.body.gravity.y = 50;
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    player.body.collides(App.info.playerGroup, this.hitPlayer, this);
    player.body.collides(coinGroup, this.hit, this);
    player.body.createBodyCallback(this.world, this.hit, this);

    var updatedScore = ('Score:' + App.info.score + '\nHealth: ' + App.info.health + '\nGold: ' + App.info.gold);
    scoreText = this.add.text(16, 16, updatedScore, {fontSize: '32px', fill: '#fff'});

    //this is important to bring in your players!!
    App.info.stageConnect();

    

  },

  hit: function(body1, body2) {
    console.log('HIT');
    App.info.score = App.info.score - 1000;
    App.info.health = App.info.health - 1;
  },


  hitPlayer: function(body1, body2) {
    console.log('HITPLAYER');
    App.info.score = App.info.score + 1000;
  },

  update: function() {

    //this function updates each player each frame- KEEP!!!
    for ( var i = 0; i < App.info.players.length; i ++) {
      if (App.info.players[i].alive) { 
        App.info.players[i].update();

        // playerCollisionGroup = this.physics.p2.createCollisionGroup();
        // this.physics.arcade.collide(player, App.info.players[i]);
      }
    }


    //controls
    var cursors = this.input.keyboard.createCursorKeys();
    // player.body.velocity.x = 0;
    // this.physics.arcade.collide(player, platforms);

    if (cursors.left.isDown) {
      player.body.rotateLeft(80);
      player.animations.play('left');
    } else if (cursors.right.isDown) {
      player.body.rotateRight(80);
      player.animations.play('right');
    } else {
      player.animations.stop();
      player.frame = 4;
      player.body.setZeroRotation();

    }
    if (cursors.up.isDown) {
      player.body.thrust(400);
      App.info.score += 5;
      // scoreText.text = 'Score:' + App.info.score;
      updatedScore = ('Score:' + App.info.score + '\nHealth: ' + App.info.health + '\nGold: ' + App.info.gold);
      scoreText.text = updatedScore;
    } else if (cursors.down.isDown) {
      player.body.reverse(400);
      App.info.score += 5;
      updatedScore = ('Score:' + App.info.score + '\nHealth: ' + App.info.health + '\nGold: ' + App.info.gold);
      scoreText.text = updatedScore;
      // scoreText.text = 'Score:' + App.info.score;
    }


    //tells the server your location each frame- KEEP!!!
    App.info.socket.emit('p2player', {
      x: player.x,
      y: player.y,
      angle: player.angle
    });

  }
};  