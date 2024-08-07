var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
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
    highscore: { type: Number, default: 0 }
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


// Add the comparePassword method to the user schema
userSchema.methods.comparePassword = function(userInputPassword, cb) {
  console.log('Candidate Password:', userInputPassword); // Debugging line
  console.log('Hashed Password:', this.password); // Debugging line

  bcrypt.compare(userInputPassword, this.password, (err, isMatch) => {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

module.exports = mongoose.model('User', userSchema);

//module.exports = Player;