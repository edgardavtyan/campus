var http = require('http');
var Response = require('./Response');
var Request = require('./Request');

var HttpServer = function() {
   var self = this;


   self.controllers = {};
   self.viewCompiler = null;


   self.setControllers = function(controllers) {
      self.controllers = controllers;
   };

   self.setViewCompiler = function(compiler) {
      self.viewCompiler = compiler;
   };

   self.start = function() {
      http.createServer(function(req, res) {
         var response = new Response(res);
         response.setViewCompiler(self.viewCompiler);

         var request = new Request(req);

         if (request.isFile()) {
            response.sendFile(request.pathname());
            return;
         }

         var controller = self.controllers[request.controllerName()];
         if (!controller) {
            response.send(404, 'text/plain', 'Controller not found');
            return;
         }

         var controllerMethod = controller[request.controllerMethod()];
         if (!controllerMethod) {
            response.send(404, 'text/plain', 'Method not found');
            return;
         }

         controllerMethod(request, response);
      }).listen(8888);
   };
};

module.exports = HttpServer;
