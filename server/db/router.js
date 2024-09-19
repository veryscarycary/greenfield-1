var express = require('express');
var router = express.Router();
var User = require('./userModel');

router
.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  const newUser = new User({ username, password });
  await newUser.save();
  req.session.user = newUser;
  res.redirect('/');
});

router.post('/signin', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }
  req.session.user = user;
  res.json({ message: 'Login successful' });
});

router.get('/logout', (req, res) => {
  req.session.destroy(function(err) {
    console.log('error: ', err);
  });
  res.json({ message: 'Logout successful' });
});

module.exports = router;
