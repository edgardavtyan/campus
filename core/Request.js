var url = require('url');

var Request = function(request) {
   var self = this;
   var baseRequest = request;

   self.pathname = function() {
      return url.parse(self.url()).pathname;
   };

   self.url = function() {
      return baseRequest.url;
   };

   self.controllerName = function() {
      var name = self.pathname().split('/')[1];
      return (name === '') ? ('home') : (name);
   };

   self.controllerMethod = function() {
      var method = self.pathname().split('/')[2];
      var noMethodSpecified = (method === undefined) || (method === '');
      return (noMethodSpecified) ? ('index') : (method);
   };

   self.controllerParams = function() {
      var params = self.pathname().split('/').slice(3);
      return (params[0] === '') ? ([]) : (params);
   };
};

module.exports = Request;
