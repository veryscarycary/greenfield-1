var mongoose = require('mongoose');

var hostname =
  process.env.ENVIRONMENT === 'production'
    ? process.env.MONGO_HOST
    : process.env.DOCKER
    ? 'mongodb'
    : 'localhost';
var mongoUrl = `mongodb://${hostname}/greenfield`;

console.log('MONGOHOST: ' + process.env.MONGO_HOST);
console.log('hostname: ' + hostname);
// Connect Mongoose to our local MongoDB via URI specified above and export it below
var db = mongoose
  .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Successfully connected to MongoDB'))
  .catch((err) => console.error('Connection error:', err));

module.exports = db;
