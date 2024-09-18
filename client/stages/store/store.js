App.store = function(game) {
  console.log('starting store');
  App.info.game = game;
};

App.store.prototype = {
  preload: function() {
    // set stage reference so we can more easily access 'this' properties in socket.io handlers
    App.info.stage = this;
    
    this.load.image('library', '/../../../assets/library.png');
    this.load.image('libraryfloor', '/../../../assets/libraryfloor.png');
    this.load.spritesheet('rangerwalk', '/../../../assets/rangerwalk.png', 39.5, 76);
    this.load.image('skull', '/../../../assets/skull.png');
    this.load.image('speedhat', '/../../../assets/speedhat.png');
    this.load.image('steak', '/../../../assets/steak.png');
    this.load.image('turtleshell', '/../../../assets/turtleshell.png');
    this.load.image('witchhat', '/../../../assets/witchhat.png');
    this.load.image('redpotion', '/../../../assets/redpotion.png');
    this.load.image('bluepotion', '/../../../assets/bluepotion.png');
    this.load.image('greenpotion', '/../../../assets/greenpotion.png');
    this.load.image('feather', '/../../../assets/feather.png');
    this.load.image('diamond2', '/../../../assets/diamond2.png');
    this.load.image('key', '/../../../assets/key.png');
    this.load.image('snowman', '/../../../assets/snowman.png');
    this.load.image('carrot', '/../../../assets/carrot.png');
    this.load.bitmapFont('pixel', '/../assets/font.png', '/../assets/font.fnt');
    this.load.image('snow', '/../../../assets/snow2.png');
    this.load.script('otherplayerstore', '/stages/store/otherplayerstore.js');
    // audio
    this.load.audio('jump1', '/../../../assets/audio/jump1.wav');
    this.load.audio('jump2', '/../../../assets/audio/jump2.wav');
    this.load.audio('jump3', '/../../../assets/audio/jump3.wav');
    this.load.audio('hurt1', '/../../../assets/audio/hurt1.wav');
    this.load.audio('hurt2', '/../../../assets/audio/hurt2.wav');
    this.load.audio('hurt3', '/../../../assets/audio/hurt3.wav');
    this.load.audio('heal', '/../../../assets/audio/heal.mp3');
    this.load.audio(
      'backgroundMusicStore',
      '/../../../assets/audio/backgroundMusicStore.wav'
    );
  },
  
  create () {
    var context = this;
    //gameworld
    this.physics.startSystem(Phaser.Physics.ARCADE);
    this.world.setBounds(0, 0, 3240, 600);
    this.physics.arcade.OVERLAP_BIAS = 10;

    // audio
    this.healSound = this.sound.add('heal', 0.3, false);
    this.jump1Sound = this.sound.add('jump1', 0.3, false);
    this.jump2Sound = this.sound.add('jump2', 0.3, false);
    this.jump3Sound = this.sound.add('jump3', 0.3, false);
    this.hurt1Sound = this.sound.add('hurt1', 0.3, false);
    this.hurt2Sound = this.sound.add('hurt2', 0.3, false);
    this.hurt3Sound = this.sound.add('hurt3', 0.3, false);
    this.backgroundMusic = this.sound.add('backgroundMusicStore', 0.2, true);
    this.backgroundMusic.play();

    //backdrop
    library = this.add.tileSprite(0, 0, 864, 160, 'library');
    library.scale.setTo(3.75, 3.75);

    //gound
    ground = this.add.sprite(0, 540, 'libraryfloor');
    ground.scale.setTo(3.75, 3.75);
    ground.enableBody = true;
    this.physics.arcade.enable(ground);
    ground.body.immovable = true;

    //player
    player = this.add.sprite(325, 0, 'rangerwalk');
    player.scale.setTo(1.75, 1.75);
    this.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;
    player.body.gravity.y = 800 * App.info.weight;
    player.animations.add('right', [0, 1, 2, 3, 4, 5], 10, true);
    this.camera.follow(player);
    player.anchor.set(0.5);

    //scoreboard
    scoreText = this.add.text(16, 16, 'Score: ' + App.info.score, {fontSize: '25px', fill: '#fff'});
    scoreText.fixedToCamera = true;

    //timer
    // this.time.events.add(Phaser.Timer.SECOND * 30, function () {
      // No longer triggering next stage on FE, BE should change it after 30 sec already
    // }, this);

    timerText = ('Time left in store: ' + App.info.stageTimeRemaining);

    timer = this.add.text(270, 10, timerText, { font: '30px Arial', fill: "#000000", align: "center" });

    timer.fixedToCamera = true;



    //store prices
    free = this.add.bitmapText(750, 60, "pixel", "free", 25);
    free.align = 'center';
    free.tint = 0x000000;

    fiveg = this.add.bitmapText(1240, 60, "pixel", "five gold", 25);
    fiveg.align = 'center';
    fiveg.tint = 0x000000;

    ftg = this.add.bitmapText(1750, 60, "pixel", "fifteen gold", 25);
    ftg.align = 'center';
    ftg.tint = 0x000000;

    thg = this.add.bitmapText(2300, 60, "pixel", "thirty gold", 25);
    thg.align = 'center';
    thg.tint = 0x000000;


    //items
    skull = this.add.sprite(600, 220, 'skull');
    skull.enableBody = true;
    skull.scale.setTo(2, 2);
    this.physics.arcade.enable(skull);

    turtleshell = this.add.sprite(900, 220, 'turtleshell');
    turtleshell.enableBody = true;
    turtleshell.scale.setTo(2, 2);
    this.physics.arcade.enable(turtleshell);

    witchhat = this.add.sprite(750, 220, 'witchhat');
    witchhat.enableBody = true;
    witchhat.scale.setTo(2, 2);
    this.physics.arcade.enable(witchhat);

    bluepotion = this.add.sprite(1280, 210, 'bluepotion');
    bluepotion.enableBody = true;
    bluepotion.scale.setTo(3, 3);
    this.physics.arcade.enable(bluepotion);

    redpotion = this.add.sprite(1130, 210, 'redpotion');
    redpotion.enableBody = true;
    redpotion.scale.setTo(3, 3);
    this.physics.arcade.enable(redpotion);

    greenpotion = this.add.sprite(1430, 210, 'greenpotion');
    greenpotion.enableBody = true;
    greenpotion.scale.setTo(3, 3);
    this.physics.arcade.enable(greenpotion);

    snowman = this.add.sprite(1830, 210, 'snowman');
    snowman.enableBody = true;
    snowman.scale.setTo(2, 2);
    this.physics.arcade.enable(snowman);

    carrot = this.add.sprite(1680, 210, 'carrot');
    carrot.enableBody = true;
    carrot.scale.setTo(2, 2);
    this.physics.arcade.enable(carrot);

    key = this.add.sprite(1980, 220, 'key');
    key.enableBody = true;
    key.scale.setTo(2.5, 2.5);
    this.physics.arcade.enable(key);

    feather = this.add.sprite(2520, 210, 'feather');
    feather.enableBody = true;
    feather.scale.setTo(2, 2);
    this.physics.arcade.enable(feather);

    speedhat = this.add.sprite(2200, 235, 'speedhat');
    speedhat.enableBody = true;
    speedhat.scale.setTo(2, 2);
    this.physics.arcade.enable(speedhat);

    steak = this.add.sprite(2350, 210, 'steak');
    steak.enableBody = true;
    steak.scale.setTo(1.5, 1.5);
    this.physics.arcade.enable(steak);


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

    //updating other players
    for ( var i = 0; i < App.info.players.length; i ++) {
      if (App.info.players[i].alive) { 
        App.info.players[i].update();
        this.physics.arcade.collide(player, App.info.players[i].player);
        this.physics.arcade.collide(ground, App.info.players[i].player);


        this.physics.arcade.overlap(App.info.players[i].player, skull, function(player, skull) {
          skull.kill();
        }, null, this);

        this.physics.arcade.overlap(App.info.players[i].player, witchhat, function(player, witchhat) {
          setTimeout(() => {
            App.info.socket.emit('store.witchHat');
          }, 200);
        }, null, this);

        this.physics.arcade.overlap(App.info.players[i].player, turtleshell, function(player, turtleshell) {
          turtleshell.kill();
        }, null, this);

        this.physics.arcade.overlap(App.info.players[i].player, bluepotion, function(player, bluepotion) {
          bluepotion.kill();
          App.info.players[i].player.tint = 0x0000ff;
        }, null, this);

        this.physics.arcade.overlap(App.info.players[i].player, redpotion, function(player, redpotion) {
          redpotion.kill();
          App.info.players[i].player.tint = 0xff0000;
        }, null, this);

        this.physics.arcade.overlap(App.info.players[i].player, greenpotion, function(player, greenpotion) {
          greenpotion.kill();
          App.info.players[i].player.tint = 0x00ff00;
        }, null, this);

        this.physics.arcade.overlap(App.info.players[i].player, carrot, function(player, carrot) {
          carrot.kill();
        }, null, this);

        this.physics.arcade.overlap(App.info.players[i].player, snowman, function(player, snowman) {
          snowman.kill();
        }, null, this);

        this.physics.arcade.overlap(App.info.players[i].player, key, function(player, key) {
          key.kill();
        }, null, this);

        this.physics.arcade.overlap(App.info.players[i].player, speedhat, function(player, speedhat) {
          speedhat.kill();
        }, null, this);

        this.physics.arcade.overlap(App.info.players[i].player, feather, function(player, feather) {
          feather.kill();
        }, null, this);

        this.physics.arcade.overlap(App.info.players[i].player, steak, function(player, steak) {
          steak.kill();
        }, null, this);
      }
    }


    //scoreboard update
    var updatedScore = ('Score:' + App.info.score + '\nHealth: ' + Math.floor(App.info.health) + '\nGold: ' + App.info.gold);
    scoreText.text = updatedScore;

    //timer update
    timerText = ('Time left in store: ' + App.info.stageTimeRemaining);
    timer.text = timerText;


    //player collisions
    player.body.velocity.x = 0;
    this.physics.arcade.collide(player, ground);

    //player item grabbing
    this.physics.arcade.overlap(player, skull, function(player, skull) {
      skull.kill(); 
      this.hurtPlayer();
      App.info.health = 1;
      App.info.color = 0xffffff;
      App.info.speed = 1;
      App.info.weight = 1;
      App.info.snow = false;
      App.info.jump = 1;
    }, null, this);

    this.physics.arcade.overlap(player, witchhat, function(player, witchhat) {
      witchhat.kill();
      setTimeout(function () {
        App.info.socket.emit('store.witchHat');
      }, 200);
    }, null, this);

    this.physics.arcade.overlap(player, turtleshell, function(player, turtleshell) {
      turtleshell.kill();
      App.info.speed = .5;
    }, null, this);

    this.physics.arcade.overlap(player, bluepotion, function(player, bluepotion) {
      if (App.info.gold >= 5) {
        bluepotion.kill();
        App.info.color = 0x0000ff;
        player.tint = 0x0000ff;
        App.info.gold -= 5;
      }  
    }, null, this);

    this.physics.arcade.overlap(player, redpotion, function(player, redpotion) {
      if (App.info.gold >= 5) {  
        redpotion.kill();
        App.info.color = 0xff0000;
        player.tint = 0xff0000;
        App.info.gold -= 5;
      }  
    }, null, this);

    this.physics.arcade.overlap(player, greenpotion, function(player, greenpotion) {
      if (App.info.gold >= 5) {
        greenpotion.kill();
        App.info.color = 0x00ff00;
        player.tint = 0x00ff00;
        App.info.gold -= 5;
      }  
    }, null, this);

    this.physics.arcade.overlap(player, carrot, function(player, carrot) {
      if (App.info.gold >= 15) {
        carrot.kill();
        this.healSound.play();
        App.info.health += 30;
        App.info.gold -= 15;
      }  
    }, null, this);

    this.physics.arcade.overlap(player, snowman, function(player, snowman) {
      if (App.info.gold >= 15) {
        snowman.kill();
        App.info.snow = true;
        App.info.gold -= 15;
        snow = this.add.tileSprite(0, 0, 800, 600, 'snow');
        snow.autoScroll(20, 50);
        snow.fixedToCamera = true;
      }  
    }, null, this);

    this.physics.arcade.overlap(player, key, function(player, key) {
      if (App.info.gold >= 15) {  
        key.kill();
        App.info.key += 1;
        App.info.gold -= 15;
      }  
    }, null, this);

    this.physics.arcade.overlap(player, speedhat, function(player, speedhat) {
      if (App.info.gold >= 30) {
        speedhat.kill();
        App.info.speed += 1;
        App.info.gold -= 30;
      }  
    }, null, this);

    this.physics.arcade.overlap(player, feather, function(player, feather) {
      if (App.info.gold >= 30) {
        feather.kill();
        App.info.weight = App.info.weight / 2;
        App.info.gold -= 30;
      }  
    }, null, this);

    this.physics.arcade.overlap(player, steak, function(player, steak) {
      if (App.info.gold >= 30) {
        steak.kill();
        this.healSound.play();
        App.info.health = App.info.health * 2;
        App.info.gold -= 30;
      }  
    }, null, this);



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
      player.body.velocity.y = -600 * App.info.jump;
      scoreText.text = 'Score:' + App.info.score;
    }


        //tells the server your location each frame- KEEP!!!
    App.info.socket.emit('move player', {
      x: player.x,
      y: player.y,
      angle: player.angle
    });

  },

  hurtPlayer: function(damage) {
    App.info.health -= damage;
    if (!hurtTimer) {
      var hurtSounds = [this.hurt1Sound, this.hurt2Sound, this.hurt3Sound];
      hurtSounds[Math.floor(Math.random() * hurtSounds.length)].play();
      
      player.tint = 0xff0000;
      hurtTimer = setTimeout(function() {
        player.tint = 0xffffff;
        hurtTimer = null;
      }, 200);
    }
  },
};    