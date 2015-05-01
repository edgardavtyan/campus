var fs = require('fs');
var mime = require('mime');
var path = require('path');
var qs = require('querystring');
var nunjucks = require('nunjucks');

var Response = function(res) {
   var self = this;
   var baseResponse = res;

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

   self.redirect = function(redirectUrl) {
      baseResponse.writeHead(302, { 'Location': redirectUrl });
      baseResponse.end();
   };

   self.render = function(view, viewData) {
      var html = nunjucks.render(view + '.html', viewData);
      self.send(200, 'text/html', html);
   };

   self.render404 = function(data) {
      if (data === undefined) {
         data = 'Page not found';
      }

      self.render('404', { body: data });
   };
};

module.exports = Response;
