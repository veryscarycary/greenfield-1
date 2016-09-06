var mongoose = require('mongoose');

var playerSchema = mongoose.Schema({
  counter: {
    type: Number,
    unique: true
  },
  connected: String
});

var Player = mongoose.model('Player', playerSchema);

module.exports = Player;