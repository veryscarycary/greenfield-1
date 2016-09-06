var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
app.use(express.static(__dirname + '/../client'));

// app.get('/', function (req, res) {
//   res.sendFile('/../client/index.html');
// });


io.on('connection', function (socket) {
  console.log('someone has connected');
  socket.on('player', function(info) {
    socket.broadcast.emit('player', info);

  });
});

http.listen(3000, "127.0.0.1");