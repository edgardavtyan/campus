var http = require('http');
var qs = require('querystring');
var ControllersReader = require('./ControllersReader.js');
var Response = require('./Response');
var Request = require('./Request');

/**
 * Represends a HTTP server
 * @class
 * @param {String} controllersFolder Folder with controllers to load
 */
function HttpServer(controllersFolder) {
   var self = this;
   var controllersReader = new ControllersReader();
   var controllers = controllersReader.read(controllersFolder);

   /**
    * Starts a HTTP server and listens on given port
    * @param  {Number} port Port to listen on
    * @return {Undefined} Undefined
    */
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

         var controllerMethod = controller[request.controllerMethodName()];
         if (!controllerMethod) {
            response.render404('Method not found');
            return;
         }

         if (request.method() === 'POST') {
            req.readBody(function(requestBody) {
               request.body = qs.parse(requestBody);
               controllerMethod(request, response);
            });
         } else {
            controllerMethod(request, response);
         }
      }).listen(port);
   };
}

module.exports = HttpServer;
