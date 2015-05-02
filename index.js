var nunjucks = require('nunjucks');
var HttpServer = require('./core/HttpServer');
var frontendControllers = require('./controllers/frontend/_imports');
var apiControllers = require('./controllers/api/_imports');


nunjucks.configure('views', { autoescape: true });

var frontendServer = new HttpServer();
frontendServer.setControllers(frontendControllers);
frontendServer.start(8888);

var apiServer = new HttpServer();
apiServer.setControllers(apiControllers);
apiServer.start(1377);
