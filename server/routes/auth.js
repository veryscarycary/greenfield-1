var express = require('express');
var router = express.Router();
var User = require('../db/userModel');

router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  const newUser = new User({ username, password });
  await newUser.save();
  req.session.user = newUser;
  res.status(201).send('Account successfully created');
});

router.post('/signin', async (req, res) => {
  console.log('SIGNIN ROUTE');
  const { username, password } = req.body;

  console.log('Username:', username); // Debugging line
  console.log('Password:', password); // Debugging line

  if (!username || !password) {
    return res.status(400).send('Username and password are required');
  }

  User.findOne({ username }, (err, user) => {
    if (err) return res.status(500).send('Error on the server.');
    if (!user) return res.status(404).send('No user found.');

    console.log(JSON.stringify(user));

    user.comparePassword(password, (err, isMatch) => {
      if (err) return res.status(500).send('Error on the server.');
      if (!isMatch) return res.status(401).send('Password is incorrect.');
      
      // Set session data for the authenticated user
      req.session.user = {
        id: user._id,
        username: user.username
      };

      // Successful login logic here
      res.status(200).send('Login successful');
    });
  });
});

router.get('/signout', (req, res) => {
  req.session.destroy(function(err) {
    console.log('error: ', err);
  });
  res.json({ message: 'Logout successful' });
});

// Middleware to check if the user is authenticated
router.get('/check', (req, res) => {
  if (req.session.user) {
    res.status(200).json({ isAuthenticated: true });
  } else {
    res.status(200).json({ isAuthenticated: false });
  }
});

module.exports = router;
