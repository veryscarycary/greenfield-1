// LOBBY

var protocol = window.location.protocol;
var hostname = window.location.hostname;
var port = window.location.port;
var socketUrl = `${protocol}//${hostname}`;

// Append the port if it exists and is not the default HTTP/HTTPS port
if (port && port !== "80" && port !== "443") {
    socketUrl += `:${port}`;
}

App.stage1 = function (game) {
  console.log('starting stage1');
  console.log(game);
  App.info.game = game;
};

App.stage1.prototype = {
  preload: function () {
    // set stage reference so we can more easily access 'this' properties in socket.io handlers
    App.info.stage = this;

    this.load.spritesheet('dude', '/../../../assets/dude.png', 32, 48);
    this.load.image('ground', '/../../../assets/platform.png');
    this.load.bitmapFont('pixel', '/../assets/font.png', '/../assets/font.fnt');
    this.load.image('background', '/../../../assets/space.png');
    this.load.spritesheet('coin', '/../../../assets/coin.png', 32, 32);
    this.load.spritesheet('box', '/../../../assets/box.png', 34, 34);
    this.load.script('otherPlayer1', '/stages/stage1/otherPlayer1.js');

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
    this.lobbyText = null;
    this.lobbyCountdown = null;
    this.lobbyCountdownText = null;

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
      'Score: ' +
      App.info.score +
      '\nHealth: ' +
      Math.floor(App.info.health) +
      '\nGold: ' +
      App.info.gold;
    scoreText = this.add.text(16, 16, updatedScore, {
      fontSize: '25px',
      fill: '#fff',
    });

    App.info.socketHandlers();

    // this is important to bring in your players!!
    // clean slate for players, and then adds self as a player to player list
    App.info.stageConnect();

    // this.key1 = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    // creates coin
    this.coin = this.createCoin();

    // box
    this.box = this.createBox();

    //item magic
    player.tint = App.info.color;

    //snow
    if (App.info.snow) {
      snow = this.add.tileSprite(0, 0, 800, 600, 'snow');
      snow.autoScroll(20, 50);
      snow.fixedToCamera = true;
    }

    App.info.socket.emit('serverInfoRequested');
  },

  update: function () {
    var context = this;
    var updatedScore =
      'Score: ' +
      App.info.score +
      '\nHealth: ' +
      Math.floor(App.info.health) +
      '\nGold: ' +
      App.info.gold;
    scoreText.text = updatedScore;

    //adds text to screen
    this.createLobbyText();

    // update countdown
    if (this.lobbyCountdownText) {
      this.lobbyCountdownText.text = App.info.stageTimeRemaining;
    }

    // remove coin if game is currently playing
    if (App.info.serverInfo) {
      if (App.info.serverInfo.activeGames.length && this.coin) {
        this.coin.kill();
        this.coin = null;
      } else if (!App.info.serverInfo.activeGames.length && !this.coin) {
        this.coin = this.createCoin();
      }
    }

    // Play background music when the game starts
    if (!this.backgroundMusic.isPlaying) {
      this.backgroundMusic.play();
    }

    // set keyboard bindings, default movement to 0, set player collision and platforms
    var cursors = this.input.keyboard.createCursorKeys();
    player.body.velocity.x = 0;

    this.enableCollisions();
    this.enableOtherPlayersCollisions();

    this.setPlayerAnimations(cursors);

    //  Allow the player to jump if they are touching the ground.
    this.setPlayerJumpPhysics(cursors);

    // this.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);

    // if (cursors.down.isDown) {
    //   this.backgroundMusic.stop();
    //   this.state.start('stage4');
    // }

    // every frame, each player will emit their x,y,angle to every player
    // including self
    App.info.socket.emit('move player', {
      x: player.x,
      y: player.y,
      angle: player.angle,
    });

    App.info.socket.emit('stage1.moveBox', {
      x: this.box.x,
      y: this.box.y,
    });
  },

  // Stage1 Utils

  createBox: function () {
    box = this.add.sprite(400, 0, 'box');
    this.physics.arcade.enable(box);
    box.body.gravity.y = 300;
    return box;
  },

  createCoin: function () {
    coin = this.add.sprite(100, 0, 'coin');
    coin.animations.add('bling', [0, 1, 2, 3, 4, 5, 6, 7, 8], 10, true);
    this.physics.arcade.enable(coin);
    coin.body.gravity.y = 300;
    coin.animations.play('bling');
    return coin;
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
    var serverInfo = App.info.serverInfo;
    var isGameActive = serverInfo && serverInfo.activeGames.length && serverInfo.activeGames[0].currentStageIndex > 0;
    
    if (isGameActive) {
      const text = 'Game in progress.\nPlease wait until the next match!'
      const approxTimeLeftText = '(Approx.   mins...)';

      if (!this.lobbyText || this.lobbyText.text !== text) {
        this.lobbyText && this.lobbyText.destroy();
        this.lobbyText = this.add.bitmapText(
          this.world.centerX - 350,
          120,
          'pixel',
          text,
          30,
        );
        this.lobbyText.align = 'center';
        this.lobbyText.tint = 0xff00ff;
      }
      if (!this.approxTimeLeft || this.approxTimeLeft.text !== approxTimeLeftText) {
        this.approxTimeLeft && this.approxTimeLeft.destroy();
        this.approxTimeLeft = this.add.bitmapText(
          this.world.centerX - 100,
          200,
          'pixel',
          approxTimeLeftText,
          20,
        );
        this.approxTimeLeft.align = 'center';
        this.approxTimeLeft.tint = 0xff00ff;
      }
      if (!this.approxTimeLeftNumber || this.approxTimeLeftNumber.text !== serverInfo.activeGames[0].approxMinutesLeft.toString()) {
        this.approxTimeLeftNumber && this.approxTimeLeftNumber.destroy();
        this.approxTimeLeftNumber = this.add.text(
          this.world.centerX + 25,
          202,
          serverInfo.activeGames[0].approxMinutesLeft,
          {
            fontSize: '22px',
            fill: 'red',
          }
        );
        this.approxTimeLeft.align = 'center';
      }
    } else {
      const text =
        'Waiting for new players!\nWhen all players are present,\n grab the coin to start!';

      if (!this.lobbyText || this.lobbyText.text !== text) {
        this.lobbyText && this.lobbyText.destroy();
        this.approxTimeLeft && this.approxTimeLeft.destroy();
        this.approxTimeLeftNumber && this.approxTimeLeftNumber.destroy();
        this.lobbyText = this.add.bitmapText(
          this.world.centerX - 300,
          120,
          'pixel',
          text,
          30,
        );
        this.lobbyText.align = 'center';
        this.lobbyText.tint = 0xff00ff;
      }
    }
  },

  createLobbyCountdownText: function () {
    var text = 'Game starting in...';
    this.startingText && this.startingText.destroy();
    this.startingText = this.add.bitmapText(
      this.world.centerX - 210,
      50,
      'pixel',
      text,
      25
    );
    this.startingText.align = 'center';
    this.startingText.tint = 0xffd700;

    this.createLobbyTimer();
  },

  createLobbyTimer: function () {
    this.lobbyCountdownText && this.lobbyCountdownText.destroy();
    this.lobbyCountdownText = this.add.text(
      this.world.centerX + 160,
      45,
      App.info.stageTimeRemaining,
      {
        fontSize: '50px',
        fill: 'gold',
      }
    );
  },

  createPlayer: function () {
    player = this.add.sprite(32, this.world.height - 150, 'dude');
    App.info.player = player;
    this.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;
    player.body.gravity.y = 300 * App.info.weight;
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);
  },

  enableCollisions: function () {
    this.physics.arcade.collide(player, platforms);
    this.physics.arcade.collide(coin, platforms);
    this.physics.arcade.collide(box, platforms);
    this.physics.arcade.collide(player, box);
    this.physics.arcade.collide(player, coin, () => {
      App.info.socket.emit('stage1.takeCoin');
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
            App.info.socket.emit('stage1.takeCoin');
          }
        );
        this.physics.arcade.collide(App.info.players[i].player, box);
      }
    }
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
      
      player.body.velocity.y = -300 * App.info.jump;
    }
  },

  startLobbyCountdown: function () {
    const COUNTDOWN_SECS = 10;

    this.lobbyCountdown = COUNTDOWN_SECS;
    this.createLobbyCountdownText();
  },

  cleanup: function() {
    this.lobbyText && this.lobbyText.destroy();
    this.startingText && this.startingText.destroy();
    this.lobbyCountdownText && this.lobbyCountdownText.destroy();
  }
};

App.info = {
  // this is the source of truth of info for the game overall
  score: 0,
  health: 100,
  gold: 0,
  players: [],
  stageTimeRemaining: 10,

  color: 0xffffff,
  speed: 1,
  weight: 1,
  snow: false,
  jump: 1,
  difficulty: 1,
  serverInfo: null,

  // sets this player's socket
  socket: io.connect(socketUrl), // sets this player's socket

  highscoreInterval: setInterval(() => {
    // Access the scope using Angular's element injector
    const controllerElement = document.getElementById('game-controller');
    const scope = angular.element(controllerElement).scope();

    // Now you can access or manipulate the scope
    scope.getUser().then(user => {
      const highscore = user.highscore;

      if (App.info.score > highscore) {
        console.log(`Updating highscore for user '${scope.user.username}'`);
        scope.updateHighscore(App.info.score);
      }
    }).catch(err => console.error('Failed to fetch user: ', err.message));
  }, 10000),

  //these event handlers trigger functions no matter what stage you are on
  socketHandlers: function () {
    App.info.socket.on('disconnected', function () {
      App.info.socketDisconnect();
    });
    App.info.socket.on('newplayer', function (data) {
      App.info.createPlayer(data);
    });
    App.info.socket.on('removed player', function (data) {
      App.info.removePlayer(data);
    });
    App.info.socket.on('moved player', function (data) {
      App.info.movePlayer(data);
    });
    App.info.socket.on('stage1.movedbox', function (data) {
      if (App.info.stage.box) {
        App.info.stage.box.x = data.x;
        App.info.stage.box.y = data.y;
      }
    });
    App.info.socket.on('stage1.coinTaken', function () {
      if (App.info.stage.coin) {
        App.info.stage.coin.kill();
        App.info.stage.coinSound.play();
        App.info.stage.startLobbyCountdown();
      }
    });
    App.info.socket.on('stage3.arrowFired', function(data) {
      App.info.stage.fireArrow(data.direction, data.shooter);
    });
    App.info.socket.on('startStage', function (stage) {
      if (App.info.stage.cleanup) {
        App.info.stage.cleanup();
      }

      App.info.stage.backgroundMusic.stop();
      App.info.stage.state.start(stage);

    });
    App.info.socket.on('stageTimeRemainingUpdated', function (stageTimeRemaining) {
      App.info.stageTimeRemaining = stageTimeRemaining;
    });
    App.info.socket.on('serverInfo', function (serverInfo) {
      App.info.serverInfo = serverInfo;
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
    if (movedPlayer.player.body) {
      movedPlayer.player.body.reset(data.x, data.y);
      movedPlayer.player.body.rotation = Phaser.Math.degToRad(data.angle);
    }

    movedPlayer.player.x = data.x;
    movedPlayer.player.y = data.y;
    movedPlayer.player.angle = data.angle;
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