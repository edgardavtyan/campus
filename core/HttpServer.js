var http = require('http');

var HttpServer = function() {
   var self = this;

   self.start = function() {
      http.createServer(function(req, res) {
         res.writeHead(404, { 'Content-Type': 'text/plain' });
         res.write('404 NOT FOUND');
         res.end();
      }).listen(8888);
   };
};

module.exports = HttpServer;
