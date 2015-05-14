var http = require('http');
var qs = require('querystring');
var ControllersReader = require('./ControllersReader.js');
var Response = require('./Response');
var Request = require('./Request');

var HttpServer = function(controllersFolder) {
   var self = this;
   var controllersReader = new ControllersReader();
   var controllers = controllersReader.read(controllersFolder);


   self.start = function(port) {
      http.createServer(function(req, res) {
         var response = new Response(res);
         var request = new Request(req);

         if (request.isFile()) {
            response.sendFile(request.pathname());
            return;
         }

         var controller = controllers[request.controllerName()];
         if (!controller) {
            response.render404('Controller not found');
            return;
         }

         var controllerMethod = controller[request.controllerMethod()];
         if (!controllerMethod) {
            response.render404('Method not found');
            return;
         }

         if (request.method() === 'POST') {
            var body = '';

            req.on('data', function(chunk) {
               body += chunk;
            });

            req.on('end', function() {
               request.body = qs.parse(body);
               controllerMethod(request, response);
            });
         } else {
            controllerMethod(request, response);
         }
      }).listen(port);
   };
};

module.exports = HttpServer;
