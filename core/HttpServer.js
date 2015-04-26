var http = require('http');
var Response = require('./Response');
var Request = require('./Request');

var HttpServer = function() {
   var self = this;

   self.controllers = {};
   self.response = new Response();
   self.request = new Request();

   self.start = function() {
      http.createServer(function(req, res) {
         self.response.load(res);
         self.request.load(req);

         if (self.request.isFile()) {
            self.response.sendFile(self.request.pathname());
            return;
         }

         var controller = self.controllers[self.request.controllerName()];
         if (!controller) {
            self.response.send(404, 'text/plain', 'Controller not found');
            return;
         }

         var controllerMethod = controller[self.request.controllerMethod()];
         if (!controllerMethod) {
            self.response.send(404, 'text/plain', 'Method not found');
            return;
         }

         controller.response = self.response;
         controller.request = self.request;
         controllerMethod();
      }).listen(8888);
   };
};

module.exports = HttpServer;
