// LOBBY

App.stage1 = function (game) {
  console.log('starting stage1');
  console.log(game);
  App.info.game = game;
};

App.stage1.prototype = {
  preload: function () {
    this.load.spritesheet('dude', '/../../../assets/dude.png', 32, 48);
    this.load.image('ground', '/../../../assets/platform.png');
    this.load.bitmapFont('pixel', '/../assets/font.png', '/../assets/font.fnt');
    this.load.image('background', '/../../../assets/space.png');
    this.load.spritesheet('coin', '/../../../assets/coin.png', 32, 32);
    this.load.spritesheet('box', '/../../../assets/box.png', 34, 34);

    // audio
    this.load.audio(
      'backgroundMusicLobby',
      '/../../../assets/audio/backgroundMusicLobby.wav'
    );
    this.load.audio('jump1', '/../../../assets/audio/jump1.wav');
    this.load.audio('jump2', '/../../../assets/audio/jump2.wav');
    this.load.audio('jump3', '/../../../assets/audio/jump3.wav');
    this.load.audio('coin', '/../../../assets/audio/coin.mp3');
  },

  create: function () {
    this.physics.startSystem(Phaser.Physics.ARCADE);
    this.add.tileSprite(0, 0, 800, 600, 'background');
    this.physics.arcade.OVERLAP_BIAS = 10;

    platforms = this.add.group();
    platforms.enableBody = true;

    this.createGround(platforms);

    this.createLedges(platforms);

    this.createPlayer();

    console.log('create');
    // audio
    this.jump1Sound = this.sound.add('jump1', 0.3, false);
    this.jump2Sound = this.sound.add('jump2', 0.3, false);
    this.jump3Sound = this.sound.add('jump3', 0.3, false);
    this.coinSound = this.sound.add('coin', 0.1, false);
    this.backgroundMusic = this.sound.add('backgroundMusicLobby', 0.1, true);
    this.backgroundMusic.play();

    var updatedScore =
      'Score:' +
      App.info.score +
      '\nHealth: ' +
      Math.floor(App.info.health) +
      '\nGold: ' +
      App.info.gold;
    scoreText = this.add.text(16, 16, updatedScore, {
      fontSize: '25px',
      fill: '#fff',
    });
    var style = { fill: 'white' };

    //adds text to screen
    this.createLobbyText();

    App.info.socketHandlers();
    App.info.socket.emit('connect'); // logs connected, clean slate for players,
    // and then adds self as a player to player list

    // this.key1 = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    // creates coin
    this.createCoin();

    // box
    this.createBox();

    //item magic
    player.tint = App.info.color;

    //snow
    if (App.info.snow) {
      snow = this.add.tileSprite(0, 0, 800, 600, 'snow');
      snow.autoScroll(20, 50);
      snow.fixedToCamera = true;
    }
  },

  update: function () {
    var context = this;
    var updatedScore =
      'Score:' +
      App.info.score +
      '\nHealth: ' +
      Math.floor(App.info.health) +
      '\nGold: ' +
      App.info.gold;
    scoreText.text = updatedScore;

    console.log('update is running');

    // Play background music when the game starts
    if (!this.backgroundMusic.isPlaying) {
      this.backgroundMusic.play();
    }

    // set keyboard bindings, default movement to 0, set player collision and platforms
    var cursors = this.input.keyboard.createCursorKeys();
    player.body.velocity.x = 0;

    this.enableCollisions();
    this.enableOtherPlayersCollisions();

    if (this.doesAnyPlayerHaveCoin()) {
      this.startLobbyCountdown();
    }

    this.setPlayerAnimations(cursors);

    //  Allow the player to jump if they are touching the ground.
    this.setPlayerJumpPhysics(cursors);

    // this.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);

    if (cursors.down.isDown) {
      this.backgroundMusic.stop();
      this.state.start('store');
    }

    // every frame, each player will emit their x,y,angle to every player
    // including self
    App.info.socket.emit('move player', {
      x: player.x,
      y: player.y,
      angle: player.angle,
    });
  },

  // Stage1 Utils

  createBox: function () {
    box = this.add.sprite(400, 0, 'box');
    this.physics.arcade.enable(box);
    box.body.gravity.y = 300;
  },

  createCoin: function () {
    coin = this.add.sprite(100, 0, 'coin');
    coin.animations.add('bling', [0, 1, 2, 3, 4, 5, 6, 7, 8], 10, true);
    this.physics.arcade.enable(coin);
    coin.body.gravity.y = 300;
    coin.animations.play('bling');
  },

  createGround: function (platforms) {
    ground = platforms.create(0, this.world.height - 64, 'ground');
    ground.scale.setTo(2, 2);
    ground.body.immovable = true;
    ground.tint = 0xff0000;
  },

  createLedges: function (platforms) {
    var ledge = platforms.create(400, 400, 'ground');
    ledge.body.immovable = true;
    ledge.tint = 0xff0000;
    ledge = platforms.create(-150, 250, 'ground');
    ledge.body.immovable = true;
    ledge.tint = 0xff0000;
  },

  createLobbyText: function () {
    var text =
      'Waiting for new players!\nWhen all players are present,\n grab the coin to start!';
    this.coolText = this.add.bitmapText(
      this.world.centerX - 300,
      120,
      'pixel',
      text,
      30
    );
    this.coolText.align = 'center';
    this.coolText.tint = 0xff00ff;
  },

  createLobbyCountdownText: function () {
    var text = 'Game starting in...';
    this.lobbyText = this.add.bitmapText(
      this.world.centerX - 210,
      50,
      'pixel',
      text,
      25
    );
    this.lobbyText.align = 'center';
    this.lobbyText.tint = 0xffd700;

    this.createLobbyTimer();
  },

  createLobbyTimer: function () {
    if (!this.lobbyCountdownText) {
      this.lobbyCountdownText = this.add.text(
        this.world.centerX + 160,
        45,
        this.lobbyCountdown,
        {
          fontSize: '50px',
          fill: 'gold',
        }
      );
    } else {
      this.lobbyCountdownText.text = this.lobbyCountdown;
    }

    this.lobbyTimer = setTimeout(() => {
      this.lobbyCountdown -= 1;

      if (this.lobbyCountdown <= 0) {
        this.backgroundMusic.stop();
        this.state.start('stage2');
      } else {
        this.lobbyTimer = this.createLobbyTimer();
      }
    }, 1000);
  },

  createPlayer: function () {
    player = this.add.sprite(32, this.world.height - 150, 'dude');
    App.info.player = player;
    this.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;
    player.body.gravity.y = 300 * App.info.weight;
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);
    player.hasCoin = false;
  },

  enableCollisions: function () {
    this.physics.arcade.collide(player, platforms);
    this.physics.arcade.collide(coin, platforms);
    this.physics.arcade.collide(box, platforms);
    this.physics.arcade.collide(player, box);
    this.physics.arcade.collide(player, coin, () => {
      player.hasCoin = true;
      this.coinSound.play();
      coin.kill();
    });
  },

  enableOtherPlayersCollisions: function () {
    // for each of the connected players, run each player's update fn
    // and set collision between all players
    for (var i = 0; i < App.info.players.length; i++) {
      if (App.info.players[i].alive) {
        App.info.players[i].update();
        this.physics.arcade.collide(player, App.info.players[i].player);
        this.physics.arcade.collide(
          App.info.players[i].player,
          coin,
          function () {
            App.info.players[i].player.hasCoin = true;
            coin.kill();
          }
        );
        this.physics.arcade.collide(App.info.players[i].player, box);
      }
    }
  },

  doesAnyPlayerHaveCoin: function () {
    return (
      App.info.player.hasCoin ||
      App.info.players.some((player) => player.hasCoin)
    );
  },

  isOnlyOnePlayer: function () {
    return App.info.players.length === 0;
  },

  setPlayerAnimations: function (cursors) {
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
  },

  setPlayerJumpPhysics: function (cursors) {
    if (cursors.up.isDown && player.body.touching.down) {
      var jumpSounds = [this.jump1Sound, this.jump2Sound, this.jump3Sound];
      jumpSounds[Math.floor(Math.random() * jumpSounds.length)].play();
      
      App.info.score += 10;
      player.body.velocity.y = -300 * App.info.jump;
    }
  },

  startLobbyCountdown: function () {
    const COUNTDOWN_SECS = 10;

    if (!this.lobbyCountdown) {
      this.lobbyCountdown = COUNTDOWN_SECS;
      this.createLobbyCountdownText();
    }
  },
};

App.info = {
  // this is the source of truth of info for the game overall
  score: 0,
  health: 100,
  gold: 0,
  players: [],
  timer: 60, // seconds (stage3)

  color: 0xffffff,
  speed: 1,
  weight: 1,
  snow: false,
  jump: 1,
  difficulty: 1,
  nextStage: null,

  // sets this player's socket
  socket: io.connect('http://localhost:3000'), // sets this player's socket

  //these event handlers trigger functions no matter what stage you are on
  socketHandlers: function () {
    App.info.socket.on('connect', function () {
      App.info.socketConnect();
    });

    App.info.socket.on('disconnected', function () {
      App.info.socketDisconnect();
    });
    App.info.socket.on('newplayer', function (data) {
      App.info.createPlayer(data);
    });
    App.info.socket.on('moveplayer', function (data) {
      App.info.movePlayer(data);
    });
    App.info.socket.on('movep2player', function (data) {
      App.info.moveP2Player(data);
    });
    App.info.socket.on('remove player', function (data) {
      App.info.removePlayer(data);
    });

    App.info.socket.on('disconnected', function () {
      App.info.socketDisconnect();
    });
    App.info.socket.on('newplayer', function (data) {
      App.info.createPlayer(data);
    });
    App.info.socket.on('moveplayer', function (data) {
      App.info.movePlayer(data);
    });
    App.info.socket.on('remove player', function (data) {
      App.info.removePlayer(data);
    });

    App.info.socket.on('stage', function () {
      App.info.stageConnect();
    });
  },
  //this function is called  when you connect to a new stage, it resets the players
  stageConnect: function () {
    console.log('stage connect');
    App.info.players.forEach(function (player) {
      player.player.kill();
    });
    App.info.players = [];
    App.info.socket.emit('repop', {
      x: player.x,
      y: player.y,
      angle: player.angle,
    });
  },

  //this is fired on our initial connect-it starts a new game
  socketConnect: function () {
    console.log('connected to server');
    console.log('players array', App.info.players);

    // sets a clean slate for players (on the screen and in array)
    App.info.players.forEach(function (player) {
      player.player.kill();
    });
    App.info.players = [];

    // lets all players know, including self, to add/create this player
    // (runs 'createPlayer')
    App.info.socket.emit('new player', {
      x: player.x,
      y: player.y,
      angle: player.angle,
    });
  },
  socketDisconnect: function () {
    // simply hears when the user disconnects from the server
    // and logs that the player has disconnected
    console.log('disconnected from server');
    App.info.socket.emit('disconnect');
  },

  //creates a player
  createPlayer: function (data) {
    var duplicate = App.info.findPlayer(data.id);

    if (duplicate) {
      // if player already found in players array, do not continue
      console.log('duplicate player');
      return;
    }

    // adds new player to array with (name, game object, player sprite object, x, y, angle)
    App.info.players.push(
      new RemotePlayer(
        data.id,
        App.info.game,
        player,
        data.x,
        data.y,
        data.angle
      )
    );
  },

  movePlayer: function (data) {
    const MOVEMENT_BUFFER = 30;

    var movedPlayer = App.info.findPlayer(data.id);

    if (!movedPlayer) {
      // if player is not in players array, don't continue
      console.log('player not found for move', data.id);
      return;
    }

    if (data.x < movedPlayer.player.x) {
      movedPlayer.player.play('left');
    } else if (data.x > movedPlayer.player.x) {
      movedPlayer.player.play('right');
    } else if (movedPlayer.player.movementBuffer > MOVEMENT_BUFFER) {
      movedPlayer.player.animations.stop();
      movedPlayer.player.frame = 4;
      movedPlayer.player.movementBuffer = 0;
    } else {
      if (!movedPlayer.player.movementBuffer) {
        movedPlayer.player.movementBuffer = 0;
      }

      movedPlayer.player.movementBuffer += 1;
    }

    // every time a player moves, the x,y,angle are set on that player object
    // including self
    movedPlayer.player.x = data.x;
    movedPlayer.player.y = data.y;
    movedPlayer.player.angle = data.angle;
    // movedPlayer.player.body.reset(data.x, data.y);
  },

  // for stage 5
  moveP2Player: function (data) {
    var movedPlayer = App.info.findPlayer(data.id);

    if (!movedPlayer) {
      // if player is not in players array, don't continue
      console.log('player not found', data.id);
      return;
    }

    // every time a player moves, the x,y,angle are set on that player object
    // including self

    movedPlayer.player.angle = data.angle;
    movedPlayer.player.body.reset(data.x, data.y);
  },

  removePlayer: function (data) {
    var removedPlayer = App.info.findPlayer(data.id);

    if (!removedPlayer) {
      // if player is not in players array, don't continue
      console.log('player not found for removal', data.id);
      return;
    }

    // wipe disconnected player from screen and remove them from player array
    removedPlayer.player.kill();
    App.info.players.splice(App.info.players.indexOf(removedPlayer), 1);
  },

  // returns player from player array or undefined
  findPlayer: function (id) {
    for (var i = 0; i < App.info.players.length; i++) {
      if (App.info.players[i].player.name === id) {
        return App.info.players[i];
      }
    }
  },
};
