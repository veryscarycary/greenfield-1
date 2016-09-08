var mongoose = require('mongoose');
//var bcrypt = require('bcrypt'); //might need this later

// var userSchema = mongoose.Schema({
//   username: {
//     type: String,
//     unique: true
//   },
//   password: String
// });

// FOR FACEBOOK AUTHENTICATION
var userSchema = mongoose.Schema({
  // local: {
  //   username: {
  //     type: String,
  //     unique: true
  //   },
  //   password: String
  // },
  facebook: {
    id: String,
    token: String,
    email: String,
    name: String
  }
});

module.exports = mongoose.model('User', userSchema);

//module.exports = Player;