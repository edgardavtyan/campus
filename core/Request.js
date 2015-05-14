var url = require('url');
var path = require('path');
var http = require('http');
var querystring = require('querystring');

function Request(req) {
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

      var dataString = (typeof data === 'object')
         ? (querystring.stringify(data))
         : (data);

      if (method === 'GET') {
         requestOptions.path += '?' + dataString;
      }

      var request = http.request(requestOptions, function(res) {
         var responseBody = '';

         res.on('data', function(chunk) {
            responseBody += chunk;
         });

         res.on('end', function() {
            callback(responseBody);
         });
      });

      if (method === 'POST') {
         request.write(dataString);
      }

      request.end();
   };

   self.sendApi = function(method, apiPath, data, callback) {
      var apiUrl = 'http://localhost:1377/' + apiPath;
      self.send(method, apiUrl, data, callback);
   };

   self.method = function() {
      return baseRequest.method;
   };

   self.query = function() {
      return querystring.parse(url.parse(self.url()).query);
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
      return (name === '') ? 'Home' : name;
   };

   self.controllerMethodName = function() {
      var specifiedMethod = self.pathname().split('/')[2];

      var isMethodSpecified =
         specifiedMethod !== undefined
         && specifiedMethod !== '';

      var actualMethod = (isMethodSpecified)
         ? specifiedMethod
         : 'index';

      return baseRequest.method + '_' + actualMethod;
   };

   self.controllerParams = function() {
      var params = self.pathname().split('/').slice(3);
      return (params[0] === '') ? [] : params;
   };

   self.readBody = function(callback) {
      var requestBody = '';

      baseRequest.on('data', function(chunk) {
         requestBody += chunk;
      });

      baseRequest.on('end', function() {
         callback(requestBody);
      });
   };
}

module.exports = Request;
