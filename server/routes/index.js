var express = require('express');
var router = express.Router();

var authRoutes = require('./auth.js');
var userRoutes = require('./users.js');
var leaderboardRoutes = require('./leaderboard.js');


router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/leaderboard', leaderboardRoutes);

module.exports = router;