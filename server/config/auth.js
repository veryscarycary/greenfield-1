/*************  FOR FACEBOOK AUTHENTICATION  *************/
var ip = require('./ip.js');
var port = require('./port.js');

module.exports = {
  'facebookAuth': {
    'clientID': '1174473392615797',
    'clientSecret': 'b6f71776c158a48e6f3b04d8f1ebab50',
    'callbackURL': `http://${ip === '0.0.0.0' ? 'localhost' : ip}:${port}/auth/facebook/callback`
    //tells fb when it responds, it's secure to send data back to this path
  }
};
