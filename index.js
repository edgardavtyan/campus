var nunjucks = require('nunjucks');
var HttpServer = require('./core/HttpServer');

nunjucks.configure('views', { autoescape: true });

var frontendServer = new HttpServer('frontend/');
frontendServer.start(8888);

var apiServer = new HttpServer('api');
apiServer.start(1377);
