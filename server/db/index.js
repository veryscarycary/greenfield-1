var mongoose = require('mongoose');


var DB_CONTAINER_NAME = process.env.DOCKER ? 'mongodb' : null;
var MONGO_URI = `mongodb://${DB_CONTAINER_NAME || 'localhost'}/greenfield`;

// Connect Mongoose to our local MongoDB via URI specified above and export it below
var db = mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Successfully connected to MongoDB'))
  .catch((err) => console.error('Connection error:', err));

module.exports = db;
