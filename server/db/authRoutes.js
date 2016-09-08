// TODO: require user model
var User = require('./userModel');
var passport = require('passport');

module.exports = function(app, passport) {
// module.exports = function() {
  // app.get('/', function(req, res) {
  //   res.render('index.js'); //TODO: fix this
  // });

  // Redirect the user to Facebook for authentication.  When complete,
  // Facebook will redirect the user back to the application at
  //     /auth/facebook/callback
  app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}));

  // Facebook will redirect the user to this URL after approval.  Finish the
  // authentication process by attempting to obtain an access token.  If
  // access was granted, the user will be logged in.  Otherwise,
  // authentication has failed.
  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { successRedirect: '../../client/profile/profile.html', //TODO: path on success
                                        failureRedirect: '../../client/fbAuth/fbAuth.html' })); //TODO: path on failure
};