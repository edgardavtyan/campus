var fs = require('fs');
var mime = require('mime');
var path = require('path');
var qs = require('querystring');

var Response = function(res) {
   var self = this;
   var baseResponse = res;
   var viewCompiler = null;


   self.setViewCompiler = function(newViewCompiler) {
      viewCompiler = newViewCompiler;
   };

   self.send = function(code, type, content) {
      baseResponse.writeHead(code, { 'Content-Type': mime.lookup(type) });
      baseResponse.write(content);
      baseResponse.end();
   };

   self.sendJson = function(code, content) {
      if (typeof content === 'object') {
         content = qs.stringify(content);
      }

      self.send(code, 'json', content);
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
      var html = viewCompiler.compile(view + '.html');
      self.send(200, 'text/html', html);
   };
};

module.exports = Response;
