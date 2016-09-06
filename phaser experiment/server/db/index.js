var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/greenfield');

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  var playerSchema = mongoose.Schema({
    counter: {
      type: Number,
      unique: true
    },
    connected: String
  });

  var Player = mongoose.model('Player', playerSchema);

  // Player.create([{counter: 1, connected: false},
  //   {counter: 2, connected: false},
  //   {counter: 3, connected: false},
  //   {counter: 4, connected: false}], function (err, result) {
  //   if (err) { console.log('ERROR when creating player slots in DB'); }
  // });
  module.exports = Player;
});
