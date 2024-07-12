/*************  FOR FACEBOOK AUTHENTICATION  *************/
var ip = require('./ip.js');
var port = require('./port.js');

var scheme = process.env.ENVIRONMENT === 'production' ? 'https' : 'http';
var baseEndpoint =
  process.env.ENVIRONMENT === 'production'
    ? process.env.RAILWAY_PUBLIC_DOMAIN
    : `${ip === '0.0.0.0' ? 'localhost' : ip}:${port}`;

var callbackURL = `${scheme}://${baseEndpoint}/auth/facebook/callback`;

module.exports = {
  facebookAuth: {
    clientID: '1174473392615797',
    clientSecret: 'b6f71776c158a48e6f3b04d8f1ebab50',
    callbackURL: callbackURL,
    //tells fb when it responds, it's secure to send data back to this path
  },
};
