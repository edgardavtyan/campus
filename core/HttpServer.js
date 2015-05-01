var http = require('http');
var qs = require('querystring');
var Response = require('./Response');
var Request = require('./Request');

var HttpServer = function() {
   var self = this;
   var controllers = {};
   var viewCompiler = null;


   self.setControllers = function(newControllers) {
      controllers = newControllers;
   };

   self.setViewCompiler = function(newViewCompiler) {
      viewCompiler = newViewCompiler;
   };

   self.start = function() {
      http.createServer(function(req, res) {
         var response = new Response(res);
         response.setViewCompiler(viewCompiler);

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
      }).listen(8888);
   };
};

module.exports = HttpServer;
