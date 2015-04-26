var url = require('url');
var path = require('path');

var Request = function() {
   var self = this;
   var baseRequest = null;


   self.load = function(req) {
      baseRequest = req;
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
      var noMethodSpecified = (method === undefined) || (method === '');
      return (noMethodSpecified) ? ('GET_index') : (baseRequest.method + '_' + method);
   };

   self.controllerParams = function() {
      var params = self.pathname().split('/').slice(3);
      return (params[0] === '') ? ([]) : (params);
   };
};

module.exports = Request;
