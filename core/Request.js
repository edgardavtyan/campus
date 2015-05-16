var url = require('url');
var path = require('path');
var http = require('http');
var querystring = require('querystring');

/**
 * Represents a wrapper around node's http.ClientRequest
 * and http.IncommingMessage
 *
 * @class
 * @param {http.IncommingMessage} req Base request
 */
function Request(req) {
   var self = this;
   var baseRequest = req;

   /**
    * Sends HTTP request with given HTTP method, url and data. Callback is
    * called when target server gives a response to request.
    *
    * @param  {String}   method    HTTP method
    * @param  {String}   rawUrl    Url to send request to
    * @param  {Any}      data      Data to send with request
    * @param  {Function} callback  Function which is called on response
    *
    * @return {undefined} Undefined
    */
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

   /**
    * Sends HTTP request to campus API server with given HTTP method,
    * api path and data. Callback is called when API server responds.
    *
    * @param  {String}   method    HTTP method
    * @param  {String}   apiPath   Url to send request to
    * @param  {Any}      data      Data to send with request
    * @param  {Function} callback  Function which is called on response
    *
    * @return {undefined} Undefined
    */
   self.sendApi = function(method, apiPath, data, callback) {
      var apiUrl = 'http://localhost:1377/' + apiPath;
      self.send(method, apiUrl, data, callback);
   };

   /**
    * Returns HTTP method name
    *
    * @return {String} HTTP method name
    */
   self.method = function() {
      return baseRequest.method;
   };

   /**
    * Returns url parameters
    *
    * @return {Object} Url parameters
    */
   self.query = function() {
      return querystring.parse(url.parse(self.url()).query);
   };

   /**
    * Returns url pathname
    *
    * @return {String} Url pathname
    */
   self.pathname = function() {
      return url.parse(self.url()).pathname;
   };

   /**
    * Returns url
    *
    * @return {String} url
    */
   self.url = function() {
      return baseRequest.url;
   };

   /**
    * Returns true if file was requested, otherwise returns false
    *
    * @return {Boolean} true if file was requested, otherwise false
    */
   self.isFile = function() {
      return path.extname(self.pathname()) !== '';
   };

   /**
    * Returns controller's name, specified in url
    *
    * @return {String} Controller's name
    */
   self.controllerName = function() {
      var name = self.pathname().split('/')[1];
      return (name === '') ? 'Home' : name;
   };

   /**
    * Returns controller's method, specified in url
    *
    * @return {String} Controller's method
    */
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

   /**
    * Returns controller's parameters, specified via url
    *
    * @return {String} Controller's parameters
    */
   self.controllerParams = function() {
      var params = self.pathname().split('/').slice(3);
      return (params[0] === '') ? [] : params;
   };

   /**
    * Asyncroniously reads request's body and calls the callback when finished
    *
    * @param  {Function} callback Callback function called when finished
    * @return {Undefined} undefined
    */
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
