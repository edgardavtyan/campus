var http = require('http');

var Util = function() {
   var self = this;


   self.makeRequest = function(options, onBodyRead) {
      http.request(options, function(res) {
         var body = '';
         res.on('data', function(chunk) {
            body += chunk;
         });

         res.on('end', function() {
            onBodyRead(res, body);
         });
      }).end();
   };
};

module.exports = new Util();
