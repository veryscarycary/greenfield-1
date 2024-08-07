var express = require('express');
var router = express.Router();
var User = require('../db/userModel');


// Get the leaderboard
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}).select('username highscore').sort({ highScore: -1 }).limit(10);
    leaderboard = users.map(user => ({ player: user.username, highscore: user.highscore }))
    res.json(leaderboard);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;