var fs = require('fs');
var path = require('path');

var Response = function(res) {
   var self = this;
   var baseResponse = res;

   self.send = function(code, type, content) {
      baseResponse.writeHead(code, { 'Content-Type': type });
      baseResponse.write(content);
      baseResponse.end();
   };

   self.sendFile = function(filePath) {
      fs.readFile(filePath, function(err, fileContent) {
         if (err) {
            self.send(404, 'text/plain', 'File not found');
            return;
         }

         self.send(200, 'text/html', fileContent.toString('utf-8'));
      });
   };

   self.render = function(view) {
      var viewPath = path.resolve('views/', view + '.html');
      fs.readFile(viewPath, function(err, fileContent) {
         if (err) {
            self.send(404, 'text/plain', 'File not found');
            return;
         }

         self.send(200, 'text/html', fileContent);
      });
   };
};

module.exports = Response;
