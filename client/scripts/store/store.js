App.store = function(game) {
  console.log('starting store');
  App.info.game = game;
};

App.store.prototype = {
  preload: function() {
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
  },
  
  create () {
    //gameworld
    this.physics.startSystem(Phaser.Physics.ARCADE);
    this.world.setBounds(0, 0, 3240, 600);
    this.physics.arcade.OVERLAP_BIAS = 10;

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
    player.body.gravity.y = 800;
    player.animations.add('right', [0, 1, 2, 3, 4, 5], 10, true);
    this.camera.follow(player);
    player.anchor.set(0.5);

    //scoreboard
    scoreText = this.add.text(16, 16, 'score: ' + App.info.score, {fontSize: '25px', fill: '#fff'});
    scoreText.fixedToCamera = true;

    //timer
    this.time.events.add(Phaser.Timer.SECOND * 20, function () {
      this.state.start('stage1');
    }, this);

    timerText = ('Time left in store: ' + this.time.events.duration);

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

    //this is important to bring in your players!!
    App.info.socketHandlers();
    App.info.stageConnect();


  },
  update: function() {
    //scoreboard update
    var updatedScore = ('Score:' + App.info.score + '\nHealth: ' + Math.floor(App.info.health) + '\nGold: ' + App.info.gold);
    scoreText.text = updatedScore;

    //timer update
    timerText = ('Time left in store: ' + this.time.events.duration);
    timer.text = timerText;


    //player collisions
    player.body.velocity.x = 0;
    this.physics.arcade.collide(player, ground);

    //player item grabbing
    this.physics.arcade.overlap(player, skull, function(player, skull) {
      skull.kill();
      App.info.gold = 0;
      App.info.health = 1;
      App.info.score = 0;
    }, null, this);

    this.physics.arcade.overlap(player, witchhat, function(player, witchhat) {
      witchhat.kill();
      this.state.start('stage1');
    }, null, this);

    this.physics.arcade.overlap(player, turtleshell, function(player, turtleshell) {
      turtleshell.kill();
      App.info.speed = .5;
    }, null, this);

    this.physics.arcade.overlap(player, bluepotion, function(player, bluepotion) {
      bluepotion.kill();
      App.info.color = 0x0000ff;
      player.tint = 0x0000ff;
    }, null, this);

    this.physics.arcade.overlap(player, redpotion, function(player, redpotion) {
      redpotion.kill();
      App.info.color = 0xff0000;
      player.tint = 0xff0000;
    }, null, this);

    this.physics.arcade.overlap(player, greenpotion, function(player, greenpotion) {
      greenpotion.kill();
      App.info.color = 0x00ff00;
      player.tint = 0x00ff00;
    }, null, this);





    //controls
    var cursors = this.input.keyboard.createCursorKeys();
    player.body.velocity.x = 0;

    if (cursors.left.isDown) {
      player.body.velocity.x = -150;
      player.animations.play('right');
      player.scale.setTo(-1.75, 1.75);
    } else if (cursors.right.isDown) {
      player.body.velocity.x = 150;
      player.animations.play('right');
      player.scale.setTo(1.75, 1.75);
    } else {
      player.animations.stop();
      player.frame = 4;

    }
    if (cursors.up.isDown && player.body.touching.down) {
      App.info.score += 10;
      player.body.velocity.y = -600;
      scoreText.text = 'Score:' + App.info.score;
    }


        //tells the server your location each frame- KEEP!!!
    App.info.socket.emit('move player', {
      x: player.x,
      y: player.y,
      angle: player.angle
    });

  },
};    