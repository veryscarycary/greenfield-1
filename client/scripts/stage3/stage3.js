App.stage3 = function(game) {
  console.log("starting stage3");
  App.info.game = game;
};

var land;

App.stage3.prototype = {
  preload: function() {
    this.load.image('scorchedEarth', '/../../../assets/caryAssets/scorched_earth.png');
    this.load.image('lavaleft1', '/../../../assets/caryAssets/lavaleft1.png');
    this.load.image('lavaleft2', '/../../../assets/caryAssets/lavaleft2.png');
    this.load.image('lavaleft3', '/../../../assets/caryAssets/lavaleft3.png');
    this.load.image('lavaright1', '/../../../assets/caryAssets/lavaright1.png');
    this.load.image('lavaright2', '/../../../assets/caryAssets/lavaright2.png');
    this.load.image('lavaright3', '/../../../assets/caryAssets/lavaright3.png');
    this.load.image('lavatop1', '/../../../assets/caryAssets/lavatop1.png');
    this.load.image('lavatop2', '/../../../assets/caryAssets/lavatop2.png');
    this.load.image('lavatop3', '/../../../assets/caryAssets/lavatop3.png');
    this.load.image('lavabottom1', '/../../../assets/caryAssets/lavabottom1.png');
    this.load.image('lavabottom2', '/../../../assets/caryAssets/lavabottom2.png');
    this.load.image('lavabottom3', '/../../../assets/caryAssets/lavabottom3.png');

    this.load.spritesheet('greenLink', '/../../../assets/caryAssets/greenLink.png', 76, 76);
    this.load.spritesheet('redLink', '/../../../assets/caryAssets/redLink.png', 76, 76);
    this.load.spritesheet('blueLink', '/../../../assets/caryAssets/blueLink.png', 76, 76);
    // this.load.image('ground', '/../../../assets/platform.png');
    this.load.script('otherPlayer3', '/scripts/stage3/otherPlayer3.js');
  },

  create: function() {
    let x = -500;
    let y = -500;
    let width = 1000;
    let height = 1000;

    this.world.setBounds(x, y, width, height);

    // Our tiled scrolling background
    land = this.add.tileSprite(0, 0, 800, 600, 'scorchedEarth');
    land.fixedToCamera = true;


    // this.physics.startSystem(Phaser.Physics.ARCADE);
    // platforms = this.add.group();
    // platforms.enableBody = true;
    // var ground = platforms.create(0, this.world.height - 64, 'ground');
    // ground.scale.setTo(2, 2);
    // ground.body.immovable = true;

    // The base of our player
    var startX = Math.round(Math.random() * (1000) - 500);
    var startY = Math.round(Math.random() * (1000) - 500);
    player = this.add.sprite(startX, startY, 'greenLink');
    console.log('Player Sprite INFO', player);
    player.anchor.setTo(0.5, 0.5);

    // player = this.add.sprite(32, this.world.height - 150, 'dude');
    this.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.collideWorldBounds = true;
    // player.body.gravity.y = 300;

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
    var timerText = (Math.floor(App.info.timer / 60) + ':' + (App.info.timer % 60));
    timerAndScoreText = this.add.text(16, 16, timerText + '\nscore: ' + App.info.score, {fontSize: '32px', fill: '#fff'});

    var style = {fill: "white"};

    var timer = setInterval(function () {
      App.info.timer--;
      if (App.info.timer === 0) {
        clearInterval(timer);
      }
    }, 1000);
    

    //this is important to bring in your players!!
    App.info.stageConnect();

    

  },

  update: function() {

    if ((App.info.timer % 60) < 10) {
      var seconds = '0' + (App.info.timer % 60);
    } else {
      var seconds = (App.info.timer % 60)
    }
    var updatedTimerAndScore = (Math.floor(App.info.timer / 60) + ':' + seconds);
    timerAndScoreText.text = updatedTimerAndScore + '\nscore: ' + App.info.score;

    //this function updates each player each frame
    for ( var i = 0; i < App.info.players.length; i ++) {
      if (App.info.players[i].alive) { 
        App.info.players[i].update();
        this.physics.arcade.collide(player, App.info.players[i].player);
      }
    }


    //controls
    var cursors = this.input.keyboard.createCursorKeys();
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;
    // this.physics.arcade.collide(player, platforms);

    if (cursors.left.isDown) {
      player.body.velocity.x = -150;
      player.animations.play('left');
    } else if (cursors.right.isDown) {
      player.body.velocity.x = 150;
      player.animations.play('right');
    } else if (cursors.up.isDown) {
      player.body.velocity.y = -150;
      player.animations.play('up');
    } else if (cursors.down.isDown) {
      player.body.velocity.y = 150;
      player.animations.play('down');
    } else {
      player.animations.stop();
      player.frame = 12;
    }

    land.tilePosition.x = -this.camera.x;
    land.tilePosition.y = -this.camera.y;
    
    //tells the server your location each frame
    App.info.socket.emit('move player', {
      x: player.x,
      y: player.y
    });

  }
};  