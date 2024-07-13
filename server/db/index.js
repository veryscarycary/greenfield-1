var mongoose = require('mongoose');

var hostname =
  process.env.MONGO_HOST || process.env.DOCKER_COMPOSE
    ? 'mongodb'
    : 'host.docker.internal';
var port = process.env.MONGO_PORT || 27017;
var username = process.env.MONGO_USERNAME || '';
var password = process.env.MONGO_PASSWORD || '';
var dbName = 'greenfield';
var mongoUrl = process.env.MONGO_PRIVATE_URL
    || `mongodb://${username}${password && `:${password}`}${
        username && '@'
      }${hostname}:${port}/${dbName}`;

console.log('MONGOURL ' + mongoUrl);

console.log('MONGOHOST: ' + process.env.MONGO_HOST);
console.log('hostname: ' + hostname);
// Connect Mongoose to our local MongoDB via URI specified above and export it below
var db = mongoose
  .connect(mongoUrl)
  .then(() => console.log('Successfully connected to MongoDB'))
  .catch((err) => {
    console.error('Connection error:', err);
    throw new Error("Couldn't connect to MongoDB Database");
  });

module.exports = db;
