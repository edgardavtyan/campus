var nunjucks = require('nunjucks');
var HttpServer = require('./core/HttpServer');
var controllers = require('./controllers/_imports');

nunjucks.configure('views', { autoescape: true });

var httpServer = new HttpServer();
httpServer.controllers = controllers;
httpServer.start();
