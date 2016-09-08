var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var db = require('./db/index');
var User = require('./db/userModel');
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var passport = require('passport');
var session = require('express-session');

var fbPassport = require('./config/passport');
fbPassport(passport);
// require('./config/passport')(passport);
// var authRoutes = require('./db/authRoutes');

app.use(express.static(__dirname + '/../client'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(session({
  secret: 'keyboard cat'
}));
// app.use('/', authRoutes(app, passport));

app.get('/', function(req, res) {
  res.redirect('/index.html');
});

app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}));

// app.get('/auth/facebook/callback', passport.authenticate('facebook', 
//   { successRedirect: '../../main.html', //TODO: path on success
//     failureRedirect: '../../index.html' })); //TODO: path on failure

app.get('/auth/facebook/callback', passport.authenticate('facebook', {failureRedirect: '../../index.html'}),
  function(req, res) {
    req.session.regenerate(function() {
      req.session.user = req.user;
      res.redirect('../../main.html');
    });
    //console.log("req------>", req.user);
    // console.log("res------>", res);
  }
);

app.get('/fetchProfile', function(req, res) {
  // console.log("req inside server.js", req.user.displayName);
  //console.log("fbPassport.curUserID: ", fbPassport.curUserID);
  console.log("req.session.user--------->", req.session.user);
  User.findOne({'facebook.id': req.session.user.facebook.id}, function(err, user) { //TODO: fix hardcoded id
    if (err) {
      res.status(500).send('error:', err);
    } else {
      res.json(user);
    }
  });
});

http.listen(3000, '127.0.0.1');