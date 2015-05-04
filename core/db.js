var Sequelize = require('sequelize');

var Db = function() {
   var self = this;
   var sequelize;

   self.init = function(database, username, password) {
      sequelize = new Sequelize(database, username, password, {
         host: 'localhost',
         dialect: 'mssql'
      });
   };

   self.query = function(query, callback) {
      sequelize.query(query).spread(function(results, metadata) {
         callback(results, metadata);
      });
   };
};

module.exports = new Db();
