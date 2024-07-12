// change depending on local or dev env; localhost or ....
var DB_CONTAINER_NAME = process.env.DOCKER ? 'mongodb' : null;
var ip = DB_CONTAINER_NAME ? '0.0.0.0' : 'localhost';

module.exports = ip;
