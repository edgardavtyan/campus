var fs = require('fs');
var mime = require('mime');
var path = require('path');
var nunjucks = require('nunjucks');

var Response = function(res) {
   var self = this;
   var baseResponse = res;

   self.send = function(code, type, content) {
      baseResponse.writeHead(code, { 'Content-Type': type });
      baseResponse.write(content);
      baseResponse.end();
   };

   self.sendFile = function(filePath) {
      var fixedFilePath = path.join(__dirname, '../', filePath);
      fs.readFile(fixedFilePath, function(err, fileContent) {
         if (err) {
            self.send(404, 'text/plain', 'File not found');
            return;
         }

         self.send(200, mime.lookup(fixedFilePath), fileContent);
      });
   };

   self.render = function(view) {
      nunjucks.render(view + '.html', {}, function(err, html) {
         if (err) {
            self.send(404, 'text/plain', 'File not found');
            return;
         }

         self.send(200, 'text/html', html);
      });
   };
};

module.exports = Response;
