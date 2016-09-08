var User = require('./userModel');

////// major work in progress below!!

module.exports.signUp = function (req, res) {
  // when POST on /
  User.create(req.body, function(err, result) {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
  // create an instance of User model and save it to the database
};

module.exports.signIn = function (req, res) {
  // when POST on /
  User.find(req.body, function(err, result) {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });

};