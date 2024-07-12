// change depending on local or dev env; localhost or ....
var ip;

if (process.env.ENVIRONMENT === 'production') {
  ip = process.env.RAILWAY_PUBLIC_DOMAIN;
} else {
  var DB_CONTAINER_NAME = process.env.DOCKER ? 'mongodb' : null;
  ip = DB_CONTAINER_NAME ? '0.0.0.0' : 'localhost';
}

module.exports = ip;
