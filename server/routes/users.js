var express = require('express');
var router = express.Router();
var User = require('../db/userModel');


// Get all users
router.get('/', (req, res) => {
  res.json(users);
});

// Get user by ID
router.get('/:username', async (req, res) => {
  try {
    // Use findOne to get a single user document
    const user = await User.findOne({ username: req.params.username });

    if (user) {
      res.json({
        username: user.username,
        highscore: user.highscore,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
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
  try {
    const { username } = req.params;
    const { highscore } = req.body;
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

module.exports = router;