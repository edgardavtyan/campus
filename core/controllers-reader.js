var glob = require('glob');
var path = require('path');

var ControllersReader = function() {
   var self = this;


   self.read = function(controllersFolder) {
      var pattern = path.join('controllers/', controllersFolder, '**/*Controller.js');
      var files = glob.sync(pattern);
      var controllers = {};
      files.forEach(function(file) {
         var controllerFileName = path.basename(file, '.js');
         var controllerName = controllerFileName.substr(0, controllerFileName.indexOf('Controller'));
         var controllerPath = path.join(__dirname, '../', file);
         var controller = require(controllerPath);
         controllers[controllerName] = controller;
      });

      return controllers;
   };
};

module.exports = new ControllersReader();
