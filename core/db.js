var Sequelize = require('sequelize');
var config = require('../config.js');

var sequelize = new Sequelize(
   config.db.dbName,
   config.db.username,
   config.db.password,
   {
      host: config.db.hostname,
      dialect: config.db.dialect,
      define: {
         timestamps: false,
         freezeTableName: true
      }
   }
);

module.exports = sequelize;
