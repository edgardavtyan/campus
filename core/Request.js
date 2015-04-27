var url = require('url');
var path = require('path');
var http = require('http');
var querystring = require('querystring');

var Request = function(req) {
   var self = this;
   var baseRequest = req;

   self.send = function(method, rawUrl, data, callback) {
      if (typeof data === 'function') {
         callback = data;
         data = '';
      }

      if (callback === undefined) {
         callback = function() {};
      }

      var parsedUrl = url.parse(rawUrl);
      var requestOptions = {
         hostname: parsedUrl.hostname,
         port: parsedUrl.port,
         path: parsedUrl.path,
         method: method
      };

      var request = http.request(requestOptions, function(res) {
         var responseBody = '';

         res.on('data', function(chunk) {
            responseBody += chunk;
         });

         res.on('end', function() {
            callback(responseBody);
         });
      });

      var dataString = (typeof data === 'object') ? (querystring.stringify(data)) : (data);
      request.write(dataString);
      request.end();
   };

   self.pathname = function() {
      return url.parse(self.url()).pathname;
   };

   self.url = function() {
      return baseRequest.url;
   };

   self.isFile = function() {
      return path.extname(self.pathname()) !== '';
   };

   self.controllerName = function() {
      var name = self.pathname().split('/')[1];
      return (name === '') ? ('home') : (name);
   };

   self.controllerMethod = function() {
      var method = self.pathname().split('/')[2];
      var isMethodSpecified = (method !== undefined) && (method !== '');
      var fullMethod = baseRequest.method + '_' + ((isMethodSpecified) ? (method) : ('index'));
      return fullMethod;
   };

   self.controllerParams = function() {
      var params = self.pathname().split('/').slice(3);
      return (params[0] === '') ? ([]) : (params);
   };
};

module.exports = Request;
