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
var players = [];
global.counter = 0;
var stage3Timer = 60;
var timerStarted = false;

app.use(express.static(__dirname + '/../client'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));
app.use('/api', routes);
// app.use('/', authRoutes(app, passport));

app.get('*', function(req, res) {
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
players: [],
currentStageIndex: 0
*/

const serverInfo = {
  activeGames: [],
  stage1: {
    wasCoinTaken: false,
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
  player.on('new player', function (data){
    newPlayer(data,this);
  });
  player.on('move player', function(data) {

    movePlayer(data, this);
  });
  player.on('repop', function (data){
    repopPlayers(data,this);
  });
  player.on('p2player', function(data){
    moveP2Player(data, this);
  });
  player.on('startTimer', function () {
    startStage3Timer(this);
  });
  player.on('shotsFired', function (data) {
    reportShotsFired(data, this);
  });
  player.on('stage1.moveBox', function(data) {
    moveBox(data, this);
  });
  player.on('stage1.takeCoin', function() {
    takeCoin();
  });
  player.on('startGame', function() {
    console.log('STARTING GAME');
    startNewGame(this);
  });
  player.on('nextStage', function (fromStage) {
    startNextStage(fromStage, this);
  });
  player.on('endGame', function() {
    endGame(this);
  });
};

var reportShotsFired = function(data, player) {
  var shootingPlayer = findPlayer(player.id);

  if (!shootingPlayer) {
    console.log('player not found, cannot move' + player.id);
    return;
  }

  player.broadcast.emit('reportShotsFired', {
    shooter: {
      id: shootingPlayer.id,
      x: shootingPlayer.getX(),
      y: shootingPlayer.getY()
    },
    direction: data.direction
  });
};


var startNewGame = function (player) {
  // const players = findPlayersInLobby();   // TODO: GET DIFFERENT PLAYERS DEPENDING ON GAME
  const newGame = constructGameObject();
  serverInfo.activeGames.push(newGame);
  io.emit('startStage', newGame.stages[newGame.currentStageIndex].stageName);
  serverInfo.stage1.wasCoinTaken = false; // reset lobby
};

var constructGameObject = function () {
  const stages = [
    {
      name: 'stage2',
      stageName: 'stage2',
      wasNextStageTriggered: false,
    },
    {
      name: 'store1',
      stageName: 'store',
      wasNextStageTriggered: false,
    },
    {
      name: 'stage3',
      stageName: 'stage3',
      wasNextStageTriggered: false,
    },
    {
      name: 'store2',
      stageName: 'store',
      wasNextStageTriggered: false,
    },
    {
      name: 'stage4',
      stageName: 'stage4',
      wasNextStageTriggered: false,
    },
    {
      name: 'store3',
      stageName: 'store',
      wasNextStageTriggered: false,
    },
    {
      name: 'stage5',
      stageName: 'stage5',
      wasNextStageTriggered: false,
    },
  ];

  const game = {
    players,
    stages,
    currentStageIndex: 0,
  };

  return game;
} 


var startNextStage = function (data, player) {
  const fromStageName = data.from;
  const game = serverInfo.activeGames[0];
  const fromStage = game.stages.find(stage => stage.name === fromStageName);

  if (fromStage.wasNextStageTriggered) {
    return;
  }
  // const startingPlayer = findPlayer(player.id);
  // console.log(serverInfo.activeGames[0].players);
  fromStage.wasNextStageTriggered = true;
  game.currentStageIndex += 1;
  // Start next stage for all players in current game
  io.emit('startStage', game.stages[game.currentStageIndex].stageName);
};

var endGame = function (player) {
  serverInfo.activeGames = [];

  // Start next stage for all players in current game
  io.emit('startStage', 'stage1');
};

var startStage3Timer = function(player) {
  if (timerStarted) { return; }
  var timer = setInterval(function () {
    stage3Timer--;
    if (stage3Timer <= 0) {
      // start next stage, cancel timer and allow it to be started again
      io.sockets.emit('startNextStage');
      clearInterval(timer);
      timerStarted = false;
    }
    // send timer to all clients
    io.sockets.emit('updateTimer', stage3Timer);
  }, 1000);
  timerStarted = true;
};

var playerDisconnect = function(player) {
  console.log('player disconnected:' + player.id);
  var removedPlayer = findPlayer(player.id);

  if (!removedPlayer) {
    console.log('player not found, cannont disconnect:' + player.id);
    return;
  }

  players.splice(players.indexOf(removedPlayer), 1);

  const game = serverInfo.activeGames[0]; // INFO MAKE PARALLEL GAMES AVAILABLE

  if (game && game.players.length === 0) {
    serverInfo.activeGames.splice(serverInfo.activeGames.indexOf(game), 1);
  }

  //tell clients to remove this specific player
  player.broadcast.emit('removed player', {id: player.id});
  console.log('players>> ', players);
};


//a function used when changing stages-similair to new player
var repopPlayers = function(data, player) {
  console.log("repopPlayers server side function called");

  //
  var pastSelf = findPlayer(player.id);
  players.splice(players.indexOf(pastSelf), 1);

  //create a new player objext
  var nPlayer = new Player(data.x, data.y, data.angle);
  if (findPlayer(player.id)) {
    console.log('player already stored in server!');
    return;
  }
  nPlayer.id = player.id;


  //send this object to existing clients
  player.broadcast.emit('newplayer', {
    id: nPlayer.id,
    x: nPlayer.getX(),
    y: nPlayer.getY(),
    angle: nPlayer.getAngle()

  });
  console.log("server side players array", players);
  //inform newly created player of previous players
  for (var i = 0; i < players.length; i ++) {
    var oldPlayer = players[i];
    player.emit('newplayer', {
      id: oldPlayer.id,
      x: oldPlayer.getX(),
      y: oldPlayer.getY(),
      angle: oldPlayer.getAngle()
    });
  }

  // //add to players array
  players.push(nPlayer);
  console.log('serverside players', players);
};


var newPlayer = function(data, player) {
  console.log("newplayer server side function called");

  //create a new player objext
  var nPlayer = new Player(data.x, data.y, data.angle);

  if (findPlayer(player.id)) {
    console.log('player already stored in server!');
    return;
  }

  nPlayer.id = player.id;


  //send this object to existing clients
  player.broadcast.emit('newplayer', {
    id: nPlayer.id,
    x: nPlayer.getX(),
    y: nPlayer.getY(),
    angle: nPlayer.getAngle()

  });


  //inform newly created player of previous players
  for (var i = 0; i < players.length; i ++) {
    var oldPlayer = players[i];
    player.emit('newplayer', {
      id: oldPlayer.id,
      x: oldPlayer.getX(),
      y: oldPlayer.getY(),
      angle: oldPlayer.getAngle()
    });
  }

  //add to players array

  players.push(nPlayer);
  console.log('serverside players', players);
};

var movePlayer = function (data, player) {
  var movedPlayer = findPlayer(player.id);

  if (!movedPlayer) {
    console.log('player not found, cannot move' + player.id);
    return;
  }

  movedPlayer.setX(data.x);
  movedPlayer.setY(data.y);
  movedPlayer.setAngle(data.angle);


  player.broadcast.emit('moved player', {
    id: movedPlayer.id,
    x: movedPlayer.getX(),
    y: movedPlayer.getY(),
    angle: movedPlayer.getAngle()
  });

};

var moveP2Player = function (data, player) {
  var movedPlayer = findPlayer(player.id);

  if (!movedPlayer) {
    console.log('player not found, cannot move' + player.id);
    return;
  }

  movedPlayer.setX(data.x);
  movedPlayer.setY(data.y);
  movedPlayer.setAngle(data.angle);

  player.broadcast.emit('movep2player', {
    id: movedPlayer.id,
    x: movedPlayer.getX(),
    y: movedPlayer.getY(),
    angle: movedPlayer.getAngle()
  });

};

var moveBox = function (data, player) {
  const positionX = data.x;
  const positionY = data.y;

  serverInfo.stage1.box.x = positionX;
  serverInfo.stage1.box.y = positionY;

  player.broadcast.emit('stage1.movedbox', {
    x: positionX,
    y: positionY,
  });
};

var takeCoin = function () {

  serverInfo.stage1.wasCoinTaken = true;

  io.emit('stage1.coinTaken');
};

var takeCoin = function () {

  serverInfo.stage1.wasCoinTaken = true;

  io.emit('stage1.coinTaken');
};

//helper function to find player in our stored players array
var findPlayer = function (id) {
  for (var i = 0; i < players.length; i++) {
    if (players[i].id === id) {
      return players[i];
    }
  }
  return false;
};

var findPlayersInLobby = function () {
  const lobbyPlayers = players.filter(player => !serverInfo.activeGames.some(activeGame => activeGame.players.includes(player)));
  return lobbyPlayers;
};

http.listen(port, ip, function() {
  console.log(`Listening on http://${ip}:${port}`);
});

// server isn't dying when CTRL-C is pressed for some reason
process.on('SIGINT', () => process.exit(1));
