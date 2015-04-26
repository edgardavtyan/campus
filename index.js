var HttpServer = require('./core/HttpServer');
var controllers = require('./controllers/_imports');

var httpServer = new HttpServer();
httpServer.controllers = controllers;
httpServer.start();
