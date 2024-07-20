// DINO WORLD

App.stage2 = function(game) {
  console.log('starting stage2');
  App.info.game = game;
};

App.stage2.prototype = {
  preload: function() {
    this.load.spritesheet('dude', '/../../../assets/dude.png', 32, 48);
    this.load.image('ground', '/../../../assets/platform.png');
    this.load.spritesheet('robocop', '/../../../assets/robocop.png', 40, 62);
    this.load.script('otherPlayer2', '/stages/stage2/otherPlayer2.js');
    this.load.image('mountains', '/../../../assets/mountains.png');
    this.load.image('ledge', '/../../../assets/ledge.png');
    this.load.spritesheet('coin', '/../../../assets/coin.png', 32, 32);
    this.load.spritesheet('raptorR', '/../../../assets/raptorR.png', 152.3, 93);
    this.load.bitmapFont('pixel', '/../assets/font.png', '/../assets/font.fnt');
    this.load.spritesheet('mayor', '/../../../assets/portraits2.png', 210, 150);
    this.load.spritesheet('trex', '/../../../assets/trex.png', 222, 145);
    this.load.spritesheet('door', '/../../../assets/door.png', 64, 64);
  },

  create: function() {
    //next stage
    App.info.nextStage = 'stage3';

    //gameworld
    this.physics.startSystem(Phaser.Physics.ARCADE);
    this.world.setBounds(0, 0, 4000, 600);
    this.physics.arcade.OVERLAP_BIAS = 10;

    //backdrop
    var mountains = this.add.tileSprite(0, 0, 960, 144, 'mountains');
    mountains.scale.setTo(4.17, 4.17);
    
    //platforms
    platforms = this.add.group();
    platforms.enableBody = true;
    ground = platforms.create(0, this.world.height - 32, 'ground');
    ground.width = 4000;
    ground.body.immovable = true;

    //ledges
    ledge1 = platforms.create(300, 400, 'ledge');
    ledge1.body.immovable = true;

    ledge2 = platforms.create(700, 400, 'ledge');
    ledge2.body.immovable = true;

    ledge3 = platforms.create(550, 300, 'ledge');
    ledge3.body.immovable = true;

    ledge4 = platforms.create(1000, 300, 'ledge');
    ledge4.body.immovable = true;

    ledge5 = platforms.create(1200, 400, 'ledge');
    ledge5.body.immovable = true;

    ledge6 = platforms.create(1300, 400, 'ledge');
    ledge6.body.immovable = true;

    ledge7 = platforms.create(1500, 400, 'ledge');
    ledge7.body.immovable = true;

    ledge8 = platforms.create(1650, 400, 'ledge');
    ledge8.body.immovable = true;

    ledge9 = platforms.create(1750, 250, 'ledge');
    ledge9.body.immovable = true;

    ledge10 = platforms.create(2000, 400, 'ledge');
    ledge10.body.immovable = true;
    ledge10.width = 200;

    ledge11 = platforms.create(2250, 400, 'ledge');
    ledge11.body.immovable = true;
    ledge11.width = 200;

    ledge12 = platforms.create(2300, 200, 'ledge');
    ledge12.body.immovable = true;
    ledge12.width = 100;

    ledge13 = platforms.create(2500, 400, 'ledge');
    ledge13.body.immovable = true;
    ledge13.width = 100;

    ledge14 = platforms.create(3000, 400, 'ledge');
    ledge14.body.immovable = true;
    ledge14.width = 100;

    ledge14 = platforms.create(3500, 400, 'ledge');
    ledge14.body.immovable = true;
    ledge14.width = 200;

    //player
    player = this.add.sprite(325, 0, 'robocop');
    player.scale.setTo(1.75, 1.75);
    this.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;
    player.body.gravity.y = 800 * App.info.weight;
    player.animations.add('right', [0, 1, 2, 3, 4, 5, 6, 7], 10, true);
    this.camera.follow(player);
    player.anchor.set(0.5);


     //box
    box = this.add.sprite(130, 0, 'box');
    box.scale.setTo(2, 2);
    this.physics.arcade.enable(box);
    box.body.collideWorldBounds = true;
    box.body.gravity.y = 300;
    box.body.mass = 5000;

    //creates coins
    coins = this.add.group();
    coins.enableBody = true;
    for (var i = 0; i < 50; i ++) {
      var coin = coins.create( i * 80, 0, 'coin');
      coin.animations.add('bling', [0, 1, 2, 3, 4, 5, 6, 7, 8], 10, true);
      coin.body.gravity.y = 500;
      coin.animations.play('bling');
    }
    
    //creates raptors
    raptors = this.add.group();
    raptors.enableBody = true;
    for (var i = 0; i < 10; i ++) {
      var raptor = raptors.create ( i * 400, 400, 'raptorR');
      raptor.animations.add('raptorRight', [0, 1, 2, 3, 4, 5], 10, true);
      raptor.animations.play('raptorRight');
      raptor.body.gravity.y = 300;
      raptor.body.velocity.x = 100 * App.info.difficulty;
      raptor.checkWorldBounds = true;
      
      raptor.events.onOutOfBounds.add(function (raptor) {
        raptor.reset(0, 400);
        raptor.body.velocity.x = 100 * App.info.difficulty;
      }, this);
    }

    //creates trexes
    trexes = this.add.group();
    trexes.enableBody = true;
    for (var i = 0; i < 4; i ++) {
      var trex = trexes.create ( i * 1000, 0, 'trex');
      trex.animations.add('trexRight', [0, 1, 2, 3], 10, true);
      trex.animations.play('trexRight');
      trex.scale.setTo(-2, 2);
      trex.body.gravity.y = 300;
      trex.body.velocity.x = -75 * App.info.difficulty;
      trex.checkWorldBounds = true;

      trex.events.onOutOfBounds.add(function (trex) {
        trex.reset(3800, 0);
        trex.body.velocity.x = -75 * App.info.difficulty;
      }, this);

    }

    //scoreboard
    scoreText = this.add.text(16, 16, 'score: ' + App.info.score, {fontSize: '25px', fill: '#fff'});
    scoreText.fixedToCamera = true;

    //intro text and image
    text = "Robert Cop, you and your friends \n better get out there\n and clean up this jungle! \n It's teeming with dinosaurs! \n Love, \n -the mayor";
    intro = this.add.bitmapText(150, 10, "pixel", text, 25);
    intro.align = 'center';
    intro.tint = 0x000000;

    headshot = this.add.sprite(80, 140, 'mayor');
    headshot.animations.add('still', [4]);
    headshot.animations.play('still');

    //intro text timer
    this.time.events.add(Phaser.Timer.SECOND * 8, function () {
      this.add.tween(intro).to( { alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
      this.add.tween(headshot).to( { alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
    }, this);

    //door
    door = this.add.sprite(3800, 100, 'door');
    door.enableBody = true;
    door.animations.add('closed', [0]);
    door.animations.play('closed');
    this.physics.arcade.enable(door);

    door.body.gravity.y = 100;

    door.scale.setTo(2.5, 2.5);

    //item magic
    player.tint = App.info.color;

    //snow
    if (App.info.snow) {
      snow = this.add.tileSprite(0, 0, 800, 600, 'snow');
      snow.autoScroll(20, 50);
      snow.fixedToCamera = true;
    }

    //this is important to bring in your players!!
    App.info.socketHandlers();
    App.info.stageConnect();

    

  },

  update: function() {
    var context = this;
    var updatedScore = ('Score:' + App.info.score + '\nHealth: ' + Math.floor(App.info.health) + '\nGold: ' + App.info.gold);
    scoreText.text = updatedScore;
    playersTouching = false;
    playerTouching = false;

    if ( App.info.players.length === 0 ) {
      playersTouching = true;
    }
    //this function updates each player each frame- KEEP!!!
    for ( var i = 0; i < App.info.players.length; i ++) {
      if (App.info.players[i].alive) { 
        App.info.players[i].update();
        this.physics.arcade.collide(player, App.info.players[i].player);
        this.physics.arcade.collide(platforms, App.info.players[i].player);
        this.physics.arcade.overlap(App.info.players[i].player, coins, function(player, coin) {
          coin.kill();
        }, null, this);
        this.physics.arcade.collide(App.info.players[i].player, box);
        this.physics.arcade.overlap(App.info.players[i].player, door, function() {
          playersTouching = true;

          warning = context.add.bitmapText(300,100,"pixel", "HURRY UP!\n DOOR CLOSES SOON!", 30);
          warning.fixedToCamera = true;
        });
      }
    }

    //player collisions
    player.body.velocity.x = 0;
    this.physics.arcade.collide(door, platforms);
    this.physics.arcade.collide(trexes, ground);
    this.physics.arcade.collide(raptors, platforms);
    this.physics.arcade.collide(coins, platforms);
    this.physics.arcade.collide(player, platforms);
    this.physics.arcade.collide(box, platforms);
    this.physics.arcade.collide(player, box);
    this.physics.arcade.overlap(player, coins, function(player, coin) {
      coin.kill();
      App.info.gold += 1;
    }, null, this);

    this.physics.arcade.overlap(player, raptors, function (player, raptor){
      App.info.health -= .1 * App.info.difficulty;
    }, null, this);

    this.physics.arcade.overlap(player, trexes, function (player, trex){
      App.info.health -= .2 * App.info.difficulty;
    }, null, this);

    this.physics.arcade.overlap(player, door, function() {
      playerTouching = true;
    });

    if (playersTouching && playerTouching) {

      setTimeout(function () {
        context.state.start('store'); 
      }, 5000);  
    }




    //controls
    var cursors = this.input.keyboard.createCursorKeys();
    player.body.velocity.x = 0;

    if (cursors.left.isDown) {
      player.body.velocity.x = -150 * App.info.speed;
      player.animations.play('right');
      player.scale.setTo(-1.75, 1.75);
    } else if (cursors.right.isDown) {
      player.body.velocity.x = 150 * App.info.speed;
      player.animations.play('right');
      player.scale.setTo(1.75, 1.75);
    } else {
      player.animations.stop();
      player.frame = 4;

    }
    if (cursors.up.isDown && player.body.touching.down) {
      App.info.score += 10;
      player.body.velocity.y = -600 * App.info.jump;
      scoreText.text = 'Score:' + App.info.score;
    }


    //death check
    if (App.info.health <= 0) {
      App.info.score = 0;
      App.info.health = 100;
      App.info.gold = 0;
      App.info.color = 0xffffff;
      App.info.speed = 1;
      App.info.weight = 1;
      App.info.snow = false;
      App.info.jump = 1;
    }

    //tells the server your location each frame- KEEP!!!
    App.info.socket.emit('move player', {
      x: player.x,
      y: player.y,
      angle: player.angle
    });

  }
};  