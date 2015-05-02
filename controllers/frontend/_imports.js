var HomeController = require('./HomeController');
var LoginController = require('./LoginController');

var controllers = {
   'home': new HomeController(),
   'login': new LoginController()
};

module.exports = controllers;
