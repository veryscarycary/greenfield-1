var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
// var userSchema = mongoose.Schema({
//   username: {
//     type: String,
//     unique: true
//   },
//   password: String
// });

var userSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    highscore: Number,
  // facebook: {
  //   id: String,
  //   token: String,
  //   email: String,
  //   name: String
  // }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

//module.exports = Player;