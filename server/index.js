var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var db = require('./db/index');
var User = require('./db/userModel');
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var passport = require('passport');
var session = require('express-session');
var ip = require('./config/ip.js');
var port = require('./config/port.js');
var path = require('path');
var routes = require('./routes/index.js');

require('./config/passport')(passport);
// var authRoutes = require('./db/authRoutes');
var Player = require('./player.js');

const STAGE_TIME_LOBBY = 10; // Lobby Countdown
const STAGE_TIME_STORE = 30;
const STAGE_TIME_ZELDA = 60;
const STAGE_TIME_PLATFORMS = 60;
const STAGE_TIME_SPACE = 60;

const GAME_ROOM_NAME = 'game0';

const TOTAL_GAME_TIME_LIMIT = 1800; // 30 minutes

var players = [];

app.use(express.static(__dirname + '/../client'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);
app.use('/api', routes);
// app.use('/', authRoutes(app, passport));

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '/../client/index.html'));
});

// app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}));

// app.get('/auth/facebook/callback', passport.authenticate('facebook', {failureRedirect: '../../index.html'}),
//   function(req, res) {
//     req.session.regenerate(function() {
//       req.session.user = req.user;
//       res.redirect('../../main.html');
//     });
//   }
// );

// app.get('/fetchProfile', function(req, res) {
//   // console.log("req inside server.js", req.user.displayName);
//   //console.log("fbPassport.curUserID: ", fbPassport.curUserID);
//   console.log("req.session.user--------->", req.session.user);
//   User.findOne({'facebook.id': req.session.user.facebook.id}, function(err, user) { //TODO: fix hardcoded id
//     if (err) {
//       res.status(500).send('error:', err);
//     } else {
//       res.json(user);
//     }
//   });
// });

/* Active Game
    players,
    stages,
    stageTimer: null,
    stageTimeRemaining: 0,
    currentStageIndex: 0,
*/

const serverInfo = {
  activeGames: [],
  stage1: {
    box: {
      x: 0,
      y: 0,
    },
  },
};

io.on('connection', function (socket) {
  connectionFuncs(socket);
});

//series of listeners started on our socket connection
var connectionFuncs = function (player) {
  console.log('new player connected:' + player.id);

  player.on('disconnect', function () {
    playerDisconnect(this);
  });
  player.on('move player', function (data) {
    movePlayer(data, this);
  });
  player.on('repop', function (data) {
    repopPlayers(data, this);
  });
  player.on('serverInfoRequested', function () {
    sendServerInfo();
  });
  player.on('stage3.fireArrow', function (data) {
    fireArrow(data, this);
  });
  player.on('stage1.moveBox', function (data) {
    moveBox(data, this);
  });
  player.on('stage1.takeCoin', function () {
    takeCoin();
  });
  player.on('stage2.nextStage', function () {
    const game = serverInfo.activeGames[0];

    if (!game.wasStage2DoorAlreadyTouched) {
      game.wasStage2DoorAlreadyTouched = true;
      game.approxMinutesLeft = calculateApproxMinutesLeft(game.stages, game.currentStageIndex);
      startNextStage(game);
      game.stageTimer = setNextStageTimer(game);
    }
  });
  player.on('store.witchHat', function () {
    const game = serverInfo.activeGames[0];

    if (!game.wasStoreWitchHatAlreadyTouched) {
      cancelStoreTimerAndStartNextStage();
    }
  });
};

function sendServerInfo() {
  io.emit('serverInfo', {
    activeGames: serverInfo.activeGames.map(game => ({
      players: game.players.map(player => ({ id: player.id })),
      stageTimeRemaining: game.stageTimeRemaining,
      currentStageIndex: game.currentStageIndex,
      approxMinutesLeft: game.approxMinutesLeft,
    })),
    players: players.map(player => ({ id: player.id })),
  });
}

var fireArrow = function (data, player) {
  var shootingPlayer = findPlayer(player.id);

  if (!shootingPlayer) {
    console.log('player not found, cannot fire arrow for ' + player.id);
    return;
  }

  io.to(GAME_ROOM_NAME).emit('stage3.arrowFired', {
    shooter: {
      id: shootingPlayer.id,
      x: shootingPlayer.getX(),
      y: shootingPlayer.getY(),
    },
    direction: data.direction,
  });
};

var startNewGame = function (player) {
  const newGame = constructGameObject();
  serverInfo.activeGames.push(newGame);
  setGameSocketRoom();
  return newGame;
};

var constructGameObject = function () {
  const stages = [
    { name: 'stage1', time: STAGE_TIME_LOBBY },
    { name: 'stage2', time: null },
    { name: 'store', time: STAGE_TIME_STORE },
    { name: 'stage3', time: STAGE_TIME_ZELDA },
    { name: 'store', time: STAGE_TIME_STORE },
    { name: 'stage4', time: STAGE_TIME_PLATFORMS },
    { name: 'store', time: STAGE_TIME_STORE },
    { name: 'stage5', time: STAGE_TIME_SPACE },
  ];

  const game = {
    players: [...players],
    stages,
    stageTimer: null,
    stageTimeRemaining: 0,
    currentStageIndex: 0,
    wasStage2DoorAlreadyTouched: false,
    wasStoreWitchHatAlreadyTouched: false,
    approxMinutesLeft: calculateApproxMinutesLeft(stages, 0),
    totalGameTime: 0,
    totalGameTimeTimer: setInterval(() => game.totalGameTime += 1, 1000),
  };

  return game;
};

var startNextStage = function (game) {
  game.currentStageIndex += 1;

  // GAME END, go back to lobby
  if (game.currentStageIndex >= game.stages.length) {
    endGame(game);
  } else {
    io.to(GAME_ROOM_NAME).emit('startStage', game.stages[game.currentStageIndex].name);
  }

  game.wasStoreWitchHatAlreadyTouched = false; // in order to reset witchhat for later store visits

  sendServerInfo();
}

// WARNING: Will start next stage loop continuously, if stage.time is a valid number
var setNextStageTimer = function (game, timeRemaining) {
  const stageTime = game.stages[game.currentStageIndex].time;
  if (stageTime && timeRemaining === undefined) {
    // Setting new stage with declared stage time
    game.stageTimeRemaining = stageTime;
    io.to(GAME_ROOM_NAME).emit('stageTimeRemainingUpdated', game.stageTimeRemaining);
  }

  return setTimeout(() => {
    game.stageTimeRemaining -= 1;
    io.to(GAME_ROOM_NAME).emit('stageTimeRemainingUpdated', game.stageTimeRemaining);

    if (game.stageTimeRemaining <= 0) {
      game.stageTimer = null;
      game.approxMinutesLeft = calculateApproxMinutesLeft(game.stages, game.currentStageIndex);
      startNextStage(game);

      // If the next stages have a countdowns, this will contiuously loop
      // through the stages for the rest of the game
      const nextStage = game.stages[game.currentStageIndex];

      if (nextStage && nextStage.time) {
        game.stageTimer = setNextStageTimer(game);
      }
    } else {
      game.stageTimer = setNextStageTimer(game, game.stageTimeRemaining);
    }
  }, 1000);
}

var cancelStoreTimerAndStartNextStage = function () {
  const game = serverInfo.activeGames[0];

  clearTimeout(game.stageTimer);
  game.stageTimer = null;

  game.approxMinutesLeft = calculateApproxMinutesLeft(game.stages, game.currentStageIndex);
  startNextStage(game);
  game.stageTimer = setNextStageTimer(game);

  game.wasStoreWitchHatAlreadyTouched = true;
}

var endGame = function(game) {
  // Start next stage for all players in current game
  io.to(GAME_ROOM_NAME).emit('startStage', 'stage1');
  resetGameSocketRoom();
  clearInterval(game.totalGameTimeTimer);
  game.totalGameTimeTimer = null;

  // NOTE: Only 1 active game supported atm, so clear all games
  serverInfo.activeGames = [];
};

var setGameSocketRoom = function() {
  // Map over the players to set their socket room and get their sockets
  serverInfo.activeGames[0].players.forEach(player => {
    player.socketRoom = GAME_ROOM_NAME;
    io.sockets.sockets[player.id].join(GAME_ROOM_NAME); // Access the socket by player ID directly
  });
};

var resetGameSocketRoom = function() {
  // Map over the players to set their socket room and get their sockets
  players.forEach(player => {
    player.socketRoom = null;
    if (io.sockets.sockets[player.id] && io.sockets.socket[player.id].rooms[GAME_ROOM_NAME]) {
      io.sockets.sockets[player.id].leave(GAME_ROOM_NAME); // Access the socket by player ID directly
    }
  });
};

var playerDisconnect = function (player) {
  console.log('player disconnected:' + player.id);
  var removedPlayer = findPlayer(player.id);

  if (!removedPlayer) {
    console.log('player not found, cannot disconnect:' + player.id);
    return;
  }

  players.splice(players.indexOf(removedPlayer), 1);
  
  const game = serverInfo.activeGames[0];
  
  if (game && game.players.indexOf(removedPlayer) >= 0) {
    game.players.splice(game.players.indexOf(removedPlayer), 1);

    // No more players remain in the game, end game
    if (game.players.length === 0) {
      endGame(game);
    }
  }

  //tell clients to remove this specific player
  player.broadcast.emit('removed player', { id: player.id });
};

//a function used when changing stages-similair to new player
var repopPlayers = function (data, player) {
  var pastSelf = findPlayer(player.id);

  // create a new player object
  var nPlayer;
  
  if (!pastSelf) {
    nPlayer = new Player(data.x, data.y, data.angle);
  } else {
    nPlayer = pastSelf;
    nPlayer.socketRoom = pastSelf.socketRoom;
  }
  nPlayer.id = player.id;
  nPlayer.setX(data.x);
  nPlayer.setY(data.y);
  nPlayer.setAngle(data.angle);

  if (player.rooms[GAME_ROOM_NAME]) {
    // send this object to existing clients(except the sender),
    // in order to render this player for already loaded-in players
    messageEveryoneInRoom(GAME_ROOM_NAME, player, 'newplayer', {
      id: nPlayer.id,
      x: nPlayer.getX(),
      y: nPlayer.getY(),
      angle: nPlayer.getAngle(),
    });

    // inform the newly created player 1 of previous players (to render all players on stage start)
    // for (var i = 0; i < players.length; i++) {
    const otherActiveGamePlayers = players.filter(player => player.id !== nPlayer.id && player.socketRoom === GAME_ROOM_NAME);
    messagePlayerToCreateOthers(player, otherActiveGamePlayers);
    // }
  } else {
    // send this object to existing clients in lobby(except the sender),
    // in order to render this player for already loaded-in players in lobby
    messageEveryoneNotInRoom(GAME_ROOM_NAME, player, 'newplayer', {
      id: nPlayer.id,
      x: nPlayer.getX(),
      y: nPlayer.getY(),
      angle: nPlayer.getAngle(),
    } );

    // inform the newly created player 1 of previous players (to render all players on stage start)
    const otherLobbyPlayers = players.filter(player => player.id !== nPlayer.id && player.socketRoom !== GAME_ROOM_NAME);
    messagePlayerToCreateOthers(player, otherLobbyPlayers);
  }

  if (!pastSelf) {
    players.push(nPlayer);
  }
};

function messagePlayerToCreateOthers(player, others) {
  others.forEach(otherPlayer => {
    player.emit('newplayer', {
      id: otherPlayer.id,
      x: otherPlayer.getX(),
      y: otherPlayer.getY(),
      angle: otherPlayer.getAngle(),
    });
  });
}

function messageEveryoneInRoom(GAME_ROOM_NAME, player, event, data) {
  player.broadcast.to(GAME_ROOM_NAME).emit(event, data);
}

// This function sends a message to everyone NOT in 'room1'
// EXCLUDING self
function messageEveryoneNotInRoom(roomName, player, event, data) {
  // Iterate over all connected sockets
  for (var socketId in io.sockets.sockets) {
      if (io.sockets.sockets.hasOwnProperty(socketId)) {
          var socket = io.sockets.sockets[socketId];

          if (socketId === player.id) {
            continue; // don't want to repop our own character
          }

          // Check if the socket is NOT in the room (therefore, in lobby)
          if (!socket.rooms[roomName]) {
              // If not in the room, emit the event with the data
              socket.emit(event, data);
          }
      }
  }
}

var movePlayer = function (data, player) {
  function hasMoved(incomingX, incomingY, incomingAngle) {
    return incomingX !== movedPlayer.getX() || incomingY !== movedPlayer.getY() || incomingAngle !== movedPlayer.getAngle();
  }

  var movedPlayer = findPlayer(player.id);

  if (!movedPlayer) {
    console.log('player not found, cannot move' + player.id);
    return;
  }

  if (hasMoved(data.x, data.y, data.angle)) {
    movedPlayer.setX(data.x);
    movedPlayer.setY(data.y);
    movedPlayer.setAngle(data.angle);
  
    player.broadcast.emit('moved player', {
      id: movedPlayer.id,
      x: movedPlayer.getX(),
      y: movedPlayer.getY(),
      angle: movedPlayer.getAngle(),
    });
  }
};

// stage 1

var moveBox = function (data, player) {
  function hasMoved(incomingX, incomingY) {
    return incomingX !== serverInfo.stage1.box.x || incomingY !== serverInfo.stage1.box.y;
  }

  const positionX = data.x;
  const positionY = data.y;

  if (hasMoved(positionX, positionY)) {
    serverInfo.stage1.box.x = positionX;
    serverInfo.stage1.box.y = positionY;
  
    player.broadcast.emit('stage1.movedbox', {
      x: positionX,
      y: positionY,
    });
  }
};

var takeCoin = function () {
  io.emit('stage1.coinTaken');
  const game = startNewGame();
  game.stageTimer = setNextStageTimer(game);
};

var calculateApproxMinutesLeft = function(stages, currentStageIndex) {
  if (currentStageIndex === stages.length - 1) {
    return 1;
  }

  const secondsLeft = stages.slice(currentStageIndex + 1).reduce((acc, curr) => {
    return typeof curr.time === 'number' ? acc + curr.time : acc;
  }, 0);
  return Math.floor(secondsLeft / 60);
};

// helper function to find player in our stored players array
var findPlayer = function (id) {
  for (var i = 0; i < players.length; i++) {
    if (players[i].id === id) {
      return players[i];
    }
  }
  return false;
};

http.listen(port, ip, function () {
  console.log(`Listening on http://${ip}:${port}`);
});

// server isn't dying when CTRL-C is pressed for some reason
process.on('SIGINT', () => process.exit(1));

setInterval(() => {
  if (players.length) {
    sendServerInfo();
  }

  // if a user sits on stage 2 long enough without progress, end the game
  if (serverInfo.activeGames.length && serverInfo.activeGames[0].totalGameTime > TOTAL_GAME_TIME_LIMIT) {
    endGame(serverInfo.activeGames[0]);
  }
}, 1000)