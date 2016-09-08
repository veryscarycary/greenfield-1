var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var Player = require('./db/Player');
var mongoose = require('mongoose');
global.counter = 0;

mongoose.connect('mongodb://localhost/greenfield');


var clients = {
  1: null,
  2: null,
  3: null,
  4: null 
};


// Event fired every time a new client connects:
io.on('connection', function(socket) {

  // counter increases to count the player number
  global.counter++;
  console.info('New client connected (Player' + global.counter + ' id=' + socket.id + ').');
  console.info('New client connected (Player' + global.counter + ' id=' + socket + ').');

  // this helps us keep track of each unique client id and player number
  clients[global.counter] = socket;
  // emits this message solely to that particular connecting client, nobody else
  io.to(socket.id).emit('setPlayer', global.counter); // <-- NEW
  // clients[global.counter].emit('setPlayer', global.counter); <-- OLD
  //emits this to all OTHER connected clients, not the current client
  socket.broadcast.emit('setOtherPlayer', 'player' + global.counter);

  // there is a problem with setOtherPlayer, in that only old instances
  // will have a chance to set the new players. the newer connections
  // will not have heard this event. need to find a way to give the whole player
  // list to everyone

  // moreover, evidenced by only the first client showing all of the players,
  // i think that player1 is the only one getting the setOtherPlayer event.

/////// these are for reporting back player movements to the clients
  socket.on('player1', function(info) {
    socket.broadcast.emit('player1', info);
  });
  socket.on('player2', function(info) {
    socket.broadcast.emit('player2', info);
  });
  socket.on('player3', function(info) {
    socket.broadcast.emit('player3', info);
  });
  socket.on('player4', function(info) {
    socket.broadcast.emit('player4', info);
  });
///////


  // When socket disconnects, remove it from the list:
  socket.on('disconnect', function() {
    for (var key in clients) {
      if (clients[key] === socket) {
        clients[key] = null;
        console.info('Client gone (id=' + socket.id + ').');
        // set counter back so when next player connects, it will fill
        // the empty spot.
        global.counter = Number(key) - 1;
      }
    }
  });
});

app.use(express.static(__dirname + '/../client'));



// io.on('connection', function (socket) {
//   console.log('someone has connected');

//   global.counter++;
//   console.log(global.counter, 'COUNTER');

//   socket.

//   // receives player# event from that player#
//   socket.on('player' + global.counter, function(info) {
//     Player.create({counter: global.counter, connected: true}, function (err, result) {
//       if (err) { console.log('ERROR when creating player slots in DB'); }
//     });

//     socket.broadcast.emit('player' + global.counter, info);
//   });
// });

http.listen(3000, '127.0.0.1');