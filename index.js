var HttpServer = require('./core/HttpServer');
var NunjucksCompiler = require('./core/NunjucksCompiler');
var controllers = require('./controllers/_imports');


var nunjucksCompiler = new NunjucksCompiler();
nunjucksCompiler.configure('views', { autoescape: true });

var httpServer = new HttpServer();
httpServer.controllers = controllers;
httpServer.start();
