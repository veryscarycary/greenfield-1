var express = require('express');
var router = express.Router();
var User = require('../db/userModel');


// Get all users
router.get('/', (req, res) => {
  res.json(users);
});

// Get user by ID
router.get('/:username', (req, res) => {
  const user = User.find(u => u.username === req.params.username);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// // Update user by ID
// router.put('/users/:username', (req, res) => {
//   const user = users.find(u => u.username === req.params.username);
//   if (user) {
//     user.name = req.body.name;
//     res.json(user);
//   } else {
//     res.status(404).json({ message: 'User not found' });
//   }
// });

// Update a user's high score
router.put('/:username/highscore', async (req, res) => {
  console.log('THE BELLLY OF THE BEAST');
  try {
    const { username } = req.params;
    const { highscore } = req.body;
    console.log('username', username);
    console.log('highscore', highscore);
    const user = await User.findOneAndUpdate(
      { username },
      { highscore },
      { new: true, runValidators: true }
    );
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get the leaderboard (top 10 users by high score)
router.get('/leaderboard', async (req, res) => {
  try {
    const leaderboard = await User.find().sort({ highScore: -1 }).limit(10);
    res.json(leaderboard);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;