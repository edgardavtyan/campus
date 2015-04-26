var http = require('http');
var Response = require('./Response');
var Request = require('./Request');

var HttpServer = function() {
   var self = this;

   self.controllers = {};
   self.response = new Response();

   self.start = function() {
      http.createServer(function(req, res) {
         var request = new Request(req);
         self.response.load(res);

         if (request.isFile()) {
            self.response.sendFile(request.pathname());
            return;
         }

         var controller = self.controllers[request.controllerName()];
         if (!controller) {
            self.response.send(404, 'text/plain', 'Controller not found');
            return;
         }

         var controllerMethod = controller[request.controllerMethod()];
         if (!controllerMethod) {
            self.response.send(404, 'text/plain', 'Method not found');
            return;
         }

         controller.response = self.response;
         controller.request = request;
         controllerMethod();
      }).listen(8888);
   };
};

module.exports = HttpServer;
