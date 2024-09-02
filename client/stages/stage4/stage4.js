// STAR LEDGES

App.stage4 = function(game) {
  console.log('starting stage4');
  App.info.game = game;
};

App.stage4.prototype = {
  preload: function() {
    // set stage reference so we can more easily access 'this' properties in socket.io handlers
    App.info.stage = this;
    
    this.load.image('sky', '/../../../assets/sky.png');
    this.load.spritesheet('dude', '/../../../assets/dude.png', 32, 48);
    this.load.image('ground', '/../../../assets/platform.png');
    // this.load.image('star', 'assets/star.png');
    this.load.image('star', '/../../../assets/star.png');
    this.load.image('diamond', '/../../../assets/diamond.png');
    // this.load.image('skull', '/../../../assets/skull.png');
    this.load.image('skull', '/../../../assets/greenpotion.png');
    this.load.image('heart', '/../../../assets/heart.png');

    // audio
    this.load.audio('diamond', '/../../../assets/audio/coin.mp3');
    this.load.audio('star', '/../../../assets/audio/star.wav');
    this.load.audio('heal', '/../../../assets/audio/heal.mp3');
    this.load.audio('poison', '/../../../assets/audio/poison.wav');
    this.load.audio('starPower', '/../../../assets/audio/starPower.wav');
    this.load.audio('backgroundMusicPlatforms', '/../../../assets/audio/backgroundMusicPlatforms.wav');

    this.load.script('otherPlayer4', '/stages/stage4/otherPlayer4.js');
  },

  create: function() {

    this.diamondSound = this.sound.add('diamond', 0.1, false);
    this.healSound = this.sound.add('heal', 0.3, false);
    this.starSound = this.sound.add('star', 0.3, false);
    this.poisonSound = this.sound.add('poison', 0.3, false);
    this.starPowerSound = this.sound.add('starPower', 0.3, true);
    this.backgroundMusic = this.sound.add('backgroundMusicPlatforms', 0.3, true);
    this.backgroundMusic.play();

    var height = 3000; //set world height here
    var time = 10;
    poison = false;
    dead = false;

    this.world.setBounds(0, 0, 800, height);
    
    this.physics.startSystem(Phaser.Physics.ARCADE);
    var sky = this.add.sprite(0, 0, 'sky');
    sky.scale.setTo(800, height);

    //add platforms
    platforms = this.add.group();
    platforms.enableBody = true;
    var ground = platforms.create(0, this.world.height - 64, 'ground');
    ground.scale.setTo(2, 2);
    ground.body.immovable = true;
    //create ledges
    // var ledge = platforms.create(400, height - 240, 'ground');
    // ledge.body.immovable = true;

    //make random ledges???
    // for (var i = height - 400; i > 0; i = i - (Math.floor(Math.random() * 120) + 180)) {
    //   this.makeLedge(i);
    // }

    for (var i = 55; i < 800; i += 100) {
      this.makeLedge(i, 2760, 0.1); 
    }

    for (var i = 0; i < 770; i += 100) {
      this.makeLedge(i, 2620, 0.1);
    }

    this.makeLedge(430, 2430, 0.2);
    this.makeLedge(-20, 2430, 0.4);
    this.makeLedge(750, 2290, 0.2); //put star on this ledge
    this.makeLedge(750, 2000, 0.2); 
    this.makeLedge(0, 2070, 0.1); 
    this.makeLedge(220, 2250, 0.3);
    this.makeLedge(380, 2090, 0.4); //reach or not?
    this.makeLedge(100, 1900, 0.3);

    this.makeLedge(350, 1750, 0.3);
    this.makeLedge(600, 1750, 0.3);
    this.makeLedge(-30, 1700, 0.3); //TODO: put star here?
    this.makeLedge(200, 1550, 0.3);
    this.makeLedge(500, 1550, 0.3);
    this.makeLedge(400, 1340, 0.15); //rainbowStar here
    this.makeLedge(0, 1360, 0.3);
    this.makeLedge(680, 1360, 0.3);
    this.makeLedge(-5, 1160, 0.15);
    this.makeLedge(760, 1160, 0.15);

    this.makeLedge(400, 930, 0.1);
    this.makeLedge(200, 990, 0.1); 
    this.makeLedge(600, 990, 0.1);

    this.makeLedge(0, 960, 0.2); //diamond?
    this.makeLedge(750, 960, 0.2);

    this.makeLedge(600, 740, 0.1); //?
    this.makeLedge(200, 740, 0.1); //?

    this.makeLedge(0, 540, 0.3); //
    this.makeLedge(700, 540, 0.3); //

    this.makeLedge(380, 290, 0.1); //main prize
    this.makeLedge(0, 380, 0.1);
    this.makeLedge(760, 380, 0.1);
    this.makeLedge(0, 240, 0.1);
    this.makeLedge(760, 240, 0.1);

    this.makeLedge(100, 70, 0.5); //top ledges
    this.makeLedge(500, 70, 0.5);


    special = false;
    player = this.add.sprite(32, this.world.height - 150, 'dude');
    //player = this.add.sprite(32, 0, 'dude');
    this.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;
    player.body.gravity.y = 300;
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);
    
    //add stars
    stars = this.add.group();
    stars.enableBody = true;

    this.makeStars(500);

    //add rainbow stars
    rainbowStars = this.add.group();
    rainbowStars.enableBody = true;

    this.makeRainbowStar(750, 2200);
    this.makeRainbowStar(400, 1300);

    //add diamonds
    diamonds = this.add.group();
    diamonds.enableBody = true;

    this.makeDiamond(30, 930);
    this.makeDiamond(760, 930);

    this.makeDiamond(300, 910, true);
    this.makeDiamond(500, 910, true);


    //randomize diamonds:
    for (var i = 0; i < 30; i++) {
      var randX = Math.floor(Math.random() * 780);
      var randY = Math.floor(Math.random() * 2920);
      this.makeDiamond(randX, randY, true);
    }

    // make diamonds disappear and then reappear in a random position
    // setInterval(function() {
    //   diamonds.destroy();
    //   diamonds = this.add.group();
    //   diamonds.enableBody = true;

    //   this.makeDiamond(30, 930);
    //   this.makeDiamond(760, 930);

    //   this.makeDiamond(300, 910, true);
    //   this.makeDiamond(500, 910, true);


    //   for (var i = 0; i < 30; i++) {
    //     var randX = Math.floor(Math.random() * 780);
    //     var randY = Math.floor(Math.random() * 2920);
    //     this.makeDiamond(randX, randY, true);
    //   }
    // }, 2000);

    //make large prize diamond at top
    prizes = this.add.group();
    prizes.enableBody = true;
    var prize = prizes.create(350, 150, 'diamond');
    prize.scale.setTo(3, 3);
    prize.body.gravity.y = 300;
    //prize.body.bounce.y = 0.7 + Math.random() * 0.2;  

    skulls = this.add.group();
    skulls.enableBody = true;

    for (var i = 0; i < 50; i++) {
      var randX = Math.floor(Math.random() * 780);
      var randY = Math.floor(Math.random() * 2920);
      this.makeSkull(randX, randY, true);
    }

    hearts = this.add.group();
    hearts.enableBody = true;

    for (var i = 0; i < 10; i++) {
      var randX = Math.floor(Math.random() * 780);
      var randY = Math.floor(Math.random() * 2920);
      this.makeHeart(randX, randY);
    }

    scoreText = this.add.text(16, 16, 'Score: ' + App.info.score, {fontSize: '25px', fill: '#fff'});
    scoreText.fixedToCamera = true;
    // timeText = this.add.text(16, 50, 'Time: ' + time, {fontSize: '32px', fill: '#fff'});
    // timeText.fixedToCamera = true;

    this.camera.follow(player);
    //tint player
    //player.tint = 0xffff00; //gold
    //player.tint = 0x00FF00; //green
    //player.tint = 0xFF0000; //red
    //player.tint = 0x00FFFF; //blue
    //player.tint = 0xAA00FF; //purple
    //player.tint = 0x000000; //all black
    //player.tint = 0xFFFFFF; //remove tint

    //ground.tint = 0x2C5800;
    ground.tint = 0xE6FFB7;

    //item magic
    player.tint = App.info.color;

    //snow
    if (App.info.snow) {
      snow = this.add.tileSprite(0, 0, 800, 600, 'snow');
      snow.autoScroll(20, 50);
      snow.fixedToCamera = true;
    }

    //timer
    this.time.events.add(Phaser.Timer.SECOND * 60, function () {
      // this.backgroundMusic.stop();
      this.starPowerSound.stop();
      // App.info.socket.emit('nextStage');
      // this.state.start('store');

      // FE NO LONGER STARTS NEXT STAGE, BE DOES IT
    }, this);

    //this is important to bring in your players!!
    App.info.stageConnect();


  },

  update: function() {

    //this function updates each player each frame- KEEP!!!
    for ( var i = 0; i < App.info.players.length; i ++) {
      if (App.info.players[i].alive) { 
        App.info.players[i].update();
        this.physics.arcade.collide(player, App.info.players[i].player);
        this.physics.arcade.overlap(App.info.players[i].player, rainbowStar, function(otherPlayer, rainbowStar) {
          this.collectRainbow(rainbowStar, 5, true, otherPlayer);
        }, null, this);
        this.physics.arcade.overlap(App.info.players[i].player, skull, function(otherPlayer, skull) {
          this.collectPoison(skull, otherPlayer);
        }, null, this);
      }
      // if (App.info.players[i].player.info.health <= 0) {
      //   this.dead(App.info.players[i].player);
      // }
    }

    // setInterval(function() {
    //   time -= 1;
    //   timeText.text = 'Time: ' + time;
    // }, 1000);

    // controls
    var cursors = this.input.keyboard.createCursorKeys();
    player.body.velocity.x = 0;
    this.physics.arcade.collide(player, platforms);
    // collide with stars/diamonds
    this.physics.arcade.collide(stars, platforms);
    this.physics.arcade.collide(rainbowStars, platforms);
    this.physics.arcade.collide(diamonds, platforms);
    this.physics.arcade.collide(prizes, platforms);
    this.physics.arcade.collide(skulls, platforms);
    this.physics.arcade.collide(hearts, platforms);

    // Checks to see if the player overlaps with any of the stars/diamonds, if he does call the collect function
    // this.physics.arcade.overlap(player, stars, this.collectStar, null, this);
    // this.physics.arcade.overlap(player, rainbowStars, this.collectRainbowStar, null, this);

    //collect stars
    this.physics.arcade.overlap(player, stars, function(player, star) {
      this.collectStar(star, 1);
    }.bind(this), function() {
      return this.checkPoison(false); 
    }.bind(this), this);

    //collect rainbowStars
    this.physics.arcade.overlap(player, rainbowStars, function(player, rainbowStar) {
      this.collectRainbowStar(rainbowStar, player);
    }.bind(this), function() {
      if (dead) {
        return false;
      } else {
        return true;
      }
    }.bind(this), this); //checkPoison here should be ok

    //collect diamonds
    this.physics.arcade.overlap(player, diamonds, function(player, diamond) {
      this.collectDiamond(diamond);
    }.bind(this), function() {
      return this.checkPoison(false);
    }.bind(this), this);

    //collect prizes
    this.physics.arcade.overlap(player, prizes, function(player, prize) {
      this.collectPrize(prize, 500, false, player);
    }.bind(this), function() {
      return this.checkPoison(false);
    }.bind(this), this);

    //collect poison
    this.physics.arcade.overlap(player, skulls, function(player, skull) {
      this.collectPoison(skull, player);
    }.bind(this), function() {
      if (special || dead) {
        return false;
      } else {
        return true;
      }
    }.bind(this), this);

    //collect hearts
    this.physics.arcade.overlap(player, hearts, function(player, heart) {
      this.collectHeart(heart, player);
    }.bind(this), function() {
      if (dead || poison) {
        return false;
      } else {
        return true;
      }
    }.bind(this), this);
    // this.physics.arcade.overlap(player, skulls, function(player, skull) {
    //   this.collectPoison(skull, player);
    // }.bind(this), this.checkPoison, this);


    if (!special) {
      if (cursors.left.isDown) {
        player.body.velocity.x = -150 * App.info.speed;
        player.animations.play('left');
      } else if (cursors.right.isDown) {
        player.body.velocity.x = 150 * App.info.speed;
        player.animations.play('right');
      } else {
        player.animations.stop();
        player.frame = 4;
      }
      // if (cursors.up.isDown) {
      //   App.info.score += 10;
      //   scoreText.text = 'Score:' + App.info.score;
      // }
      //  Allow the player to jump if they are touching the ground.
      if (cursors.up.isDown && player.body.touching.down) {
        player.body.velocity.y = -350;
      }
    } else {
      if (cursors.left.isDown) {
        //  Move to the left        
        player.body.velocity.x = -400 * App.info.speed;
        player.animations.play('left');
      } else if (cursors.right.isDown) {
          //  Move to the right
        player.body.velocity.x = 400 * App.info.speed;
        player.animations.play('right');
      } else {
          //  Stand still
        player.animations.stop();
        player.frame = 4;
      }
      //  Allow the player to jump if they are touching the ground.
      if (cursors.up.isDown && player.body.touching.down) {
        player.body.velocity.y = -400;
      }    
    }


    // //  Allow the player to jump if they are touching the ground.
    // if (cursors.up.isDown && player.body.touching.down) {
    //   player.body.velocity.y = -350;
    // }
    //update scoreboard
    var updatedScore = ('Score: ' + App.info.score + '\nHealth: ' + Math.floor(App.info.health) + '\nGold: ' + App.info.gold);
    scoreText.text = updatedScore;

    //if player's health goes below zero, don't allow player to play anymore...;
    if (App.info.health <= 0) {
      this.dead(player);
      poison = false;
      App.info.gold = Math.floor(App.info.gold / 2); //lose half your gold if you die
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

  },
  makeLedge: function(X, Y, scaleX) {
    // var rand = Math.floor(Math.random() * 820);
    scaleX = scaleX || 1;
    ledge = platforms.create(X, Y, 'ground');
    // ledge.scale.setTo(Math.random(), 1);
    ledge.scale.setTo(scaleX, 1);
    ledge.body.immovable = true;
  },
  makeRainbow: function(sprite) {

    var rainbow = setInterval(function() {
      var colors = ['0xffff00', '0x00FF00', '0xFF0000', 
                    '0x00FFFF', '0xAA00FF', '0xFFFFFF', 
                    '0xFF00DD', '0x000FFF'];
      var rand = Math.floor(Math.random() * colors.length);
      sprite.tint = colors[rand];
    }, 100);

    return rainbow;
  },
  collectPrize: function(item, points) {
    item.kill();
    this.diamondSound.play();
    App.info.gold += 30;
    if (special) {
      App.info.score += (2 * points); //each star worth 3 extra points during special
    } else {
      App.info.score += points;
    }
    scoreText.text = 'Score: ' + App.info.score;
  },
  collectStar: function(item, points) {
    item.kill();
    this.starSound.play();
    if (special) {
      App.info.score += (points + 3); //each star worth 3 extra points during special
    } else {
      App.info.score += points;
    }
    scoreText.text = 'Score: ' + App.info.score;
  },
  collectDiamond: function(item) {
    item.kill();
    this.diamondSound.play();
    App.info.gold++;
  },
  collectRainbowStar: function(item, player) {
    item.kill();
    this.enableStarPower(10000, player);
  },
  collectHeart: function(item, player) {
    item.kill();
    this.healSound.play();
    App.info.health += 10;
    //console.log("poison is collected");
    if (poison) {
      player.tint = '0xffffff';
    }
  },
  collectPoison: function(item, player) {
    item.kill();
    poison = true;
    this.poisonSound.play();
    App.info.health -= (5 * App.info.difficulty);
    //console.log('poison is collected: ', poison);
    player.tint = '0x000000';
    setTimeout(function() {
      player.tint = '0xFFFFFF';
      poison = false;
    }, 3000);
  },
  checkPoison: function(allow) { 
    //allow means allow to be collected
    //console.log('inside check poison: ', poison);

    if (App.info.health <= 0) {
      return false;
    }
    if (allow) {
      return true;
    }
    if ((poison && !special)) {
      //console.log("poison is on");
      return false;
    } else {
      //console.log("poison is off");
      return true;
    }
  },
  enableStarPower: function(timeout, player) {
    special = true; //turn on special: jumping powers and each start worth more

    if (this.starPowerTimeout) {
      clearTimeout(this.starPowerTimeout);
      this.starPowerTimeout = null;
    }

    if (this.backgroundMusic.isPlaying) {
      this.backgroundMusic.pause();
    }

    if (this.starPowerSound.isPlaying) {
      this.starPowerSound.stop();
    };

    this.starPowerSound.play();

    if (!this.starPowerRainbowInterval) {
      this.starPowerRainbowInterval = this.makeRainbow(player);
    }

    player.scale.setTo(2, 2);
    player.y = player.y - 10;
    // player.y = player.y + 15;
    // player.y = player.y - 10;
    this.starPowerTimeout = setTimeout(() => {
      clearInterval(this.starPowerRainbowInterval);
      player.tint = 0xFFFFFF; //remove tint
      player.scale.setTo(1, 1);
      special = false;

      if (this.starPowerSound.isPlaying) {
        this.starPowerSound.pause();
        this.backgroundMusic.play();
      }
    }, timeout);
  },
  // enableStarPowerOther: function(timeout, otherPlayer) {
  //   specialOther = true; //turn on special: jumping powers and each start worth more

  //   var rainbow = this.makeRainbow(otherPlayer);
  //   otherPlayer.scale.setTo(2, 2);
  //   setTimeout(function() {
  //     clearInterval(rainbow);
  //     otherPlayer.tint = 0xFFFFFF; //remove tint
  //     otherPlayer.scale.setTo(1, 1);
  //     specialOther = false;
  //   }, timeout);
  // },
  makeStars: function(num) {
    for (var i = 0; i < num; i++) {
      var randX = Math.floor(Math.random() * 780);
      var randY = Math.floor(Math.random() * 2920);
      var star = stars.create(randX, randY, 'star');
      star.body.gravity.y = 300;
      star.body.bounce.y = 0.7 + Math.random() * 0.2;   
    }
  },
  makeRainbowStar: function(X, Y) {
    rainbowStar = rainbowStars.create(X, Y, 'star');
    rainbowStar.scale.setTo(2, 2);
    rainbowStar.body.gravity.y = 300;
    rainbowStar.body.bounce.y = 0.7 + Math.random() * 0.2;
    this.makeRainbow(rainbowStar);
  },
  makeDiamond: function(X, Y, float) {
    float = float || false;
    diamond = diamonds.create(X, Y, 'diamond');
    //diamond.scale.setTo(1, 1);
    if (!float) {
      diamond.body.gravity.y = 300;
      diamond.body.bounce.y = 0.7 + Math.random() * 0.2;
    }
    //this.makeRainbow(diamond);
  },
  makeSkull: function(X, Y, float) {
    float = float || false;
    skull = skulls.create(X, Y, 'skull');
    skull.scale.setTo(0.8, 0.8);
    skull.tint = '0x6D4161';
    //diamond.scale.setTo(1, 1);
    if (!float) {
      skull.body.gravity.y = 300;
      skull.body.bounce.y = 0.7 + Math.random() * 0.2;
    }
    //this.makeRainbow(diamond);
  },
  makeHeart: function(X, Y, float) {
    float = float || false;
    heart = hearts.create(X, Y, 'heart');
    heart.scale.setTo(0.1, 0.1);
    //heart.tint = '0x6D4161';
    //diamond.scale.setTo(1, 1);
    if (!float) {
      heart.body.gravity.y = 300;
      heart.body.bounce.y = 0.7 + Math.random() * 0.2;
    }
    //this.makeRainbow(diamond);
  },
  dead: function(player) {
    dead = true;
    player.alpha = 0.5;
  }
};  

//make platforms
//make more stars
//make a blinky star
//collect blinky star changes player's color
//collect blinky star changes player's velocity
//collect bliny star changes player's star points

//make more platforms
//make canvas larger... vertically
//make more platforms
//add diamonds near top

//black stars will turn you black and prevent you from being able to collect for 5 seconds
//change special gravity
//fix score to display at the top
















