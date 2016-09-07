var Router = require('express').Router();
var Controller = require('./Controller');

//// work in progress!!

Router.route('/signup')
.post(Controller.createOne);

Router.route('/signin')
.post(Controller);

module.exports = Router;
