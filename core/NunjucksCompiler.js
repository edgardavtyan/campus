var nunjucks = require('nunjucks');

var NunjucksCompiler = function() {
   var self = this;


   self.compile = function(view, viewData) {
      return nunjucks.render(view, viewData);
   };

   self.configure = function(config) {
      nunjucks.configure(config);
   };
};

module.exports = NunjucksCompiler;
