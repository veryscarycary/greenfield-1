var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var db = require('./db/index');
var User = require('./db/userModel');
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var passport = require('passport');

require('./config/passport')(passport);
// var authRoutes = require('./db/authRoutes');

app.use(express.static(__dirname + '/../client'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
// app.use('/', authRoutes(app, passport));

app.get('/', function(req, res) {
  res.redirect('/index.html');
});

app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}));

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { successRedirect: '../../main.html', //TODO: path on success
                                        failureRedirect: '../../index.html' })); //TODO: path on failure


http.listen(3000, '127.0.0.1');