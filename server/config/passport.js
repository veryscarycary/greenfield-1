// TODO: require user model
var User = require('../db/userModel');

var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var configAuth = require('./auth');

module.exports = function(passport) {
  passport.use(new FacebookStrategy({
    clientID: configAuth.facebookAuth.clientID,
    clientSecret: configAuth.facebookAuth.clientSecret,
    profileFields: ['id', 'displayName', 'email'], 
    callbackURL: configAuth.facebookAuth.callbackURL
  }, 
    function(accessToken, refreshToken, profile, done) {
      //process.nextTick is used for async functions
      process.nextTick(function() {
        User.findOne({'facebook.id': profile.id}, function(err, user) { 
          if (err) {
            return done(err);
          }
          if (user) { //if a user is found
            return done(null, user);
          } else {
            var newUser = new User({ //TODO: remember to require user as 'User'
              'facebook.id': profile.id,
              'facebook.token': accessToken,
              'facebook.name': profile.name.givenName + ' ' + profile.name.familyName,
              'facebook.email': profile.emails[0].value
            }); 

            newUser.save(function(err, data) {
              if (err) {
                throw err;
              }
              return done(null, newUser);
            });
          }
        });
      });
    }
  ));

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    done(null, user);
  });
};
