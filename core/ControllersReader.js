var glob = require('glob');
var path = require('path');

var ControllersReader = function() {
   var self = this;


   self.read = function(controllersFolder) {
      var controllersGlobPattern = path.join('controllers/', controllersFolder,
                                             '**/*Controller.js');
      var controllerFiles = glob.sync(controllersGlobPattern);
      var controllers = {};
      controllerFiles.forEach(function(controllerFile) {
         var controllerFileName = path.basename(controllerFile, '.js');
         var controllerNameLength = controllerFileName.indexOf('Controller');
         var controllerName = controllerFileName.substr(0, controllerNameLength);
         var controllerPath = path.join(__dirname, '../', controllerFile);
         var controller = require(controllerPath);
         controllers[controllerName] = controller;
      });

      return controllers;
   };
};

module.exports = ControllersReader;
