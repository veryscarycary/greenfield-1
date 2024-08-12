// ZELDA

App.stage3 = function(game) {
  console.log("starting stage3");
  App.info.game = game;
};

var land;

// var Arrow = function (game, key) {
//   Phaser.Sprite.call(this, game, 0, 0, key);
//   this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
//   this.anchor.set(0.5);
//   this.checkWorldBounds = true;
//   this.outOfBoundsKill = true;
//   this.exists = false;
//   this.tracking = false;
//   this.scaleSpeed = 0;
// };
// Arrow.prototype = Object.create(Phaser.Sprite.prototype);
// Arrow.prototype.constructor = Arrow;
// Arrow.prototype.fire = function (x, y, angle, speed, gx, gy) {
//   gx = gx || 0;
//   gy = gy || 0;
//   this.reset(x, y);
//   this.scale.set(1);
//   this.game.physics.arcade.velocityFromAngle(angle, speed, this.body.velocity);
//   this.angle = angle;
//   this.body.gravity.set(gx, gy);
// };
// Arrow.prototype.update = function () {
//   if (this.tracking) {
//     this.rotation = Math.atan2(this.body.velocity.y, this.body.velocity.x);
//   }
//   if (this.scaleSpeed > 0) {
//     this.scale.x += this.scaleSpeed;
//     this.scale.y += this.scaleSpeed;
//   }
// };

var arrows;
var arrowTime = 0;
var Weapon = {};


// Weapon.SingleArrow = function (game) {
//   Phaser.Group.call(this, game, game.world, 'Single Arrow', false, true, Phaser.Physics.ARCADE);
//   this.nextFire = 450;
//   this.fireRate = 100;

//   for (var i = 0; i < 64; i++) {
//     this.add(new Arrow(game, 'arrow'), true);
//   }
//   return this;
// };
// Weapon.SingleArrow.prototype = Object.create(Phaser.Group.prototype);
// Weapon.SingleArrow.prototype.constructor = Weapon.SingleArrow;
// Weapon.SingleArrow.prototype.fire = function (source, angle) {
//   if (this.game.time.time < this.nextFire) { return; }
//   var x = source.x + 10;
//   var y = source.y + 10;
//   this.getFirstExists(false).fire(x, y, angle, this.arrowSpeed, 0, 0);
//   this.nextFire = this.game.time.time + this.fireRate;
// };

App.stage3.prototype = {
  weapons: [],
  preload: function() {
    this.load.image('scorchedEarth', '/../../../assets/caryAssets/scorched_earth.png');
    // this.load.image('lavaleft1', '/../../../assets/caryAssets/lavaleft1.png');
    // this.load.image('lavaleft2', '/../../../assets/caryAssets/lavaleft2.png');
    // this.load.image('lavaleft3', '/../../../assets/caryAssets/lavaleft3.png');
    // this.load.image('lavaright1', '/../../../assets/caryAssets/lavaright1.png');
    // this.load.image('lavaright2', '/../../../assets/caryAssets/lavaright2.png');
    // this.load.image('lavaright3', '/../../../assets/caryAssets/lavaright3.png');
    // this.load.image('lavatop1', '/../../../assets/caryAssets/lavatop1.png');
    // this.load.image('lavatop2', '/../../../assets/caryAssets/lavatop2.png');
    // this.load.image('lavatop3', '/../../../assets/caryAssets/lavatop3.png');
    // this.load.image('lavabottom1', '/../../../assets/caryAssets/lavabottom1.png');
    // this.load.image('lavabottom2', '/../../../assets/caryAssets/lavabottom2.png');
    // this.load.image('lavabottom3', '/../../../assets/caryAssets/lavabottom3.png');
    this.load.image('arrow', '/../../../assets/caryAssets/arrow.png');
    this.load.spritesheet('poof', '/../../../assets/caryAssets/smoke.png', 45, 45);
    this.load.spritesheet('splat', '/../../../assets/caryAssets/blood.png', 45, 45);

    this.load.spritesheet('greenLink', '/../../../assets/caryAssets/greenLink.png', 76, 76);
    this.load.spritesheet('greenLinkAttackRL', '/../../../assets/caryAssets/greenLinkAttackRL.png', 85, 76);
    this.load.spritesheet('greenLinkAttackUD', '/../../../assets/caryAssets/greenLinkAttackUD.png', 76, 95);
    this.load.spritesheet('redLink', '/../../../assets/caryAssets/redLink.png', 76, 76);
    this.load.spritesheet('blueLink', '/../../../assets/caryAssets/blueLink.png', 76, 76);
    this.load.spritesheet('coin', '/../../../assets/coin.png', 32, 32);
    this.load.spritesheet('box', '/../../../assets/box.png', 34, 34);

    this.load.audio('coin', '/../../../assets/audio/coin.mp3');
    this.load.audio('arrow', '/../../../assets/audio/arrow.wav');
    this.load.audio('backgroundMusicZelda', '/../../../assets/audio/backgroundMusicZelda.wav');

    // this.load.image('ground', '/../../../assets/platform.png');
    this.load.script('otherPlayer3', '/stages/stage3/otherPlayer3.js');
  },

  playersNotInGroup: true,

  create: function() {
    this.physics.startSystem(Phaser.Physics.ARCADE);

    this.coinSound = this.sound.add('coin', 0.8, false);
    this.arrowSound = this.sound.add('arrow', 0.5, false);
    this.backgroundMusic = this.sound.add('backgroundMusicZelda', 0.4, true);
    this.backgroundMusic.play();

    App.info.nextStage = 'stage4';
    App.info.lastDirection = 'left';


    let x = -500;
    let y = -500;
    let width = 1000;
    let height = 1000;

    this.world.setBounds(x, y, width, height);

    // Our tiled scrolling background
    land = this.add.tileSprite(0, 0, 800, 600, 'scorchedEarth');
    land.fixedToCamera = true;


    // The base of our player
    var startX = Math.round(Math.random() * (1000) - 500);
    var startY = Math.round(Math.random() * (1000) - 500);
    player = this.add.sprite(startX, startY, 'greenLink');
    console.log('Player Sprite INFO', player);
    player.anchor.setTo(0.5, 0.5);

    this.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.collideWorldBounds = true;

    player.body.drag.setTo(200, 200);
    player.body.maxVelocity.setTo(400, 400);
    player.body.collideWorldBounds = true;

    player.bringToTop();

    this.camera.follow(player);
    this.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
    this.camera.focusOnXY(0, 0);

    player.animations.add('right', [0, 1], 16, true);
    player.animations.add('up', [4, 5], 16, true);
    player.animations.add('left', [8, 9], 16, true);
    player.animations.add('down', [12, 13], 16, true);

    player.animations.add('attackRight', [2], 16, true);
    player.animations.add('attackUp', [6], 16, true);
    player.animations.add('attackLeft', [10], 16, true);
    player.animations.add('attackDown', [14], 16, true);


    var timerText = (Math.floor(App.info.timer / 60) + ':' + (App.info.timer % 60));
    timerAndScoreText = this.add.text(16, 16, (timerText + '\nScore: ' + App.info.score + '\nHealth: ' + Math.floor(App.info.health) + '\nGold: ' + App.info.gold), {fontSize: '32px', fill: '#fff'});
    timerAndScoreText.fixedToCamera= true;

    var style = {fill: "white"};


    //creates coins
    coins = this.add.group();
    coins.enableBody = true;
    for (var i = 0; i < 50; i++) {
      var startX = Math.round(Math.random() * (1000) - 500);
      var startY = Math.round(Math.random() * (1000) - 500);
      var coin = coins.create( startX, startY, 'coin');
      coin.animations.add('bling', [0, 1, 2, 3, 4, 5, 6, 7, 8], 10, true);
      this.physics.arcade.enable(coin);
      coin.animations.play('bling');
    }

    //creates boxes
    boxes = this.add.group();
    boxes.enableBody = true;
    for (var i = 0; i < 10; i ++) {
      var startX = Math.round(Math.random() * (1000) - 500);
      var startY = Math.round(Math.random() * (1000) - 500);
      var box = boxes.create(startX, startY, 'box');
      box.scale.setTo(2, 2);
      this.physics.arcade.enable(box);
      box.body.collideWorldBounds = true;
      box.body.mass = 5000;
    }

    arrows = this.add.group();
    arrows.enableBody = true;
    arrows.physicsBodyType = Phaser.Physics.ARCADE;
    arrows.createMultiple(30, 'arrow');
    arrows.setAll('anchor.x', 0.5);
    arrows.setAll('anchor.y', 0.5);
    arrows.setAll('outOfBoundsKill', true);
    arrows.setAll('checkWorldBounds', true);

    smokes = this.add.group();
    smokes.createMultiple(30, 'splat');
    smokes.forEach(setupSmoke, this);

    // App.info.socket.emit('startTimer');


    //item magic
    player.tint = App.info.color;

    //snow
    if (App.info.snow) {
      snow = this.add.tileSprite(0, 0, 800, 600, 'snow');
      snow.autoScroll(20, 50);
      snow.fixedToCamera = true;
    }


    //this is important to bring in your players!!
    App.info.stageConnect();

    

  },

  update: function() {

    var context = this;
    ////////// TIMER AND SCORE
    App.info.socket.on('updateTimer', function(serverTimer) {
      App.info.timer = serverTimer;
    });

    //timer
    this.time.events.add(Phaser.Timer.SECOND * 60, function () {
      this.backgroundMusic.stop();
      this.state.start('store');
    }, this);

    // App.info.socket.on('startNextStage', function() { startNextStage(context); });


    // if ((App.info.timer % 60) < 10) {
    //   var seconds = '0' + (App.info.timer % 60);
    // } else {
    //   var seconds = (App.info.timer % 60);
    // }
    var seconds = Math.floor(this.time.events.duration / 1000);
    var updatedTimerAndScore = (0 + ':' + seconds);
    timerAndScoreText.text = (updatedTimerAndScore + '\nScore: ' + App.info.score + '\nHealth: ' + Math.floor(App.info.health) + '\nGold: ' + App.info.gold);

    ////////// INTERPLAYER COLLISIONS

    //this function updates each player each frame
    for ( var i = 0; i < App.info.players.length; i ++) {
      if (App.info.players[i].alive) { 
        App.info.players[i].update();
        this.physics.arcade.collide(player, App.info.players[i].player);
        this.physics.arcade.overlap(App.info.players[i].player, coins, (player, coin) => {
          this.coinSound.play();
          coin.kill();
        }, null, this);
        this.physics.arcade.collide(App.info.players[i].player, boxes);

        this.physics.arcade.overlap(arrows, App.info.players[i].player, collisionHandlerEnemy, null, this);
        this.physics.arcade.overlap(arrows, player, collisionHandlerPlayer, null, this);
        // App.info.players[i].player.anchor.x = 0.5;
        // App.info.players[i].player.anchor.y = 0.5;
        // App.info.players[i].player.animations.add('smoke');
      }
    }

    // player collisions
    this.physics.arcade.collide(player, boxes);
    this.physics.arcade.overlap(player, coins, (player, coin) => {
      this.coinSound.play();
      coin.kill();
      App.info.gold += 1;
    }, null, this);

    App.info.socket.on('updateTimer', function(serverTimer) {
      App.info.timer = serverTimer;
    });
    
    //////// ENEMY ARROWS
    App.info.socket.on('reportShotsFired', function(data) {
      this.fireArrow(data.direction, data.shooter);
    });


    ///////// CONTROLS

    var cursors = this.input.keyboard.createCursorKeys();
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;

    this.handleUserInput(cursors, player);

    land.tilePosition.x = -this.camera.x;
    land.tilePosition.y = -this.camera.y;

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
    
    //tells the server your location each frame
    App.info.socket.emit('move player', {
      x: player.x,
      y: player.y
    });

  },

  fireArrow: function(direction, shooter) {
    shooter = shooter || player;
  
    var fire = function (xORy, speed, spacingx, spacingy, shooter) {
      arrow.reset(shooter.x + spacingx, shooter.y + spacingy);
      arrow.body.velocity[xORy] = speed;
      arrowTime = App.info.game.time.now + 200;
    };
  
    //  To avoid them being allowed to fire too fast we set a time limit
    if (App.info.game.time.now > arrowTime) {
      //  Grab the first arrow we can from the pool
      arrow = arrows.getFirstExists(false);
      this.arrowSound.play();
  
      if (arrow && direction === 'up') {
          //  And fire it
        fire('y', -400, 0, -60, shooter);
      } else if (arrow && direction === 'down') {
        fire('y', 400, 0, 60, shooter);
      } else if (arrow && direction === 'left') {
        fire('x', -400, -60, 0, shooter);
      } else if (arrow && direction === 'right') {
        fire('x', 400, 60, 0, shooter);
      }
    }
  },

  handleUserInput: function(cursors, player) {
    if (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
      if (cursors.left.isDown) {
        App.info.socket.emit('shotsFired', {direction: 'left'});
        player.animations.play('attackLeft');
        this.fireArrow('left');
      } else if (cursors.right.isDown) {
        App.info.socket.emit('shotsFired', {direction: 'right'});
        player.animations.play('attackRight');
        this.fireArrow('right');
      } else if (cursors.up.isDown) {
        App.info.socket.emit('shotsFired', {direction: 'up'});
        player.animations.play('attackUp');
        this.fireArrow('up');
      } else if (cursors.down.isDown) {
        App.info.socket.emit('shotsFired', {direction: 'down'});
        player.animations.play('attackDown');
        this.fireArrow('down');
      } else {
        App.info.socket.emit('shotsFired', {direction: App.info.lastDirection});
        player.animations.play('attack' + App.info.lastDirection[0].toUpperCase() + App.info.lastDirection.slice(1));
        this.fireArrow(App.info.lastDirection);
      }
    }
  
    else if (cursors.left.isDown) {
      player.body.velocity.x = -150 * App.info.speed;
      player.animations.play('left');
      App.info.lastDirection = 'left';
    } else if (cursors.right.isDown) {
      player.body.velocity.x = 150 * App.info.speed;
      player.animations.play('right');
      App.info.lastDirection = 'right';
    } else if (cursors.up.isDown) {
      player.body.velocity.y = -150 * App.info.speed;
      player.animations.play('up');
      App.info.lastDirection = 'up';
    } else if (cursors.down.isDown) {
      player.body.velocity.y = 150 * App.info.speed;
      player.animations.play('down');
      App.info.lastDirection = 'down';
    } else {
      player.animations.stop();
      player.frame = 12;
    }
  }
};

function setupSmoke(smoke) {
  smoke.anchor.x = .1;
  smoke.anchor.y = .1;
  smoke.animations.add('splat');
}

function startNextStage (context) {
  context.state.start('store');
}

function resetArrow (arrow) {
    //  Called if the arrow goes out of the screen
    arrow.kill();
}

function collisionHandlerPlayer (player, arrow) {
  //  When an arrow hits our player, we kill the arrow
  arrow.kill();

  //  decrease the health
  App.info.health -= 1 * App.info.difficulty;

   // And create a smoke :)
  var smoke = smokes.getFirstExists(false);
  smoke.reset(player.body.x, player.body.y);
  smoke.play('splat', 30, false, true);
};

function collisionHandlerEnemy (enemyPlayer, arrow) {

  //  When an arrow hits another player, we kill the arrow
  arrow.kill();

  //  Increase the score
  App.info.score += 20;

   // And create a smoke :)
  var smoke = smokes.getFirstExists(false);
  smoke.reset(enemyPlayer.body.x, enemyPlayer.body.y);
  smoke.play('splat', 30, false, true);
};