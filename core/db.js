var Sequelize = require('sequelize');

var sequelize = new Sequelize('test1', 'sa', '260994', {
   host: 'localhost',
   dialect: 'mssql',
   define: {
      timestamps: false,
      freezeTableName: true
   }
});

module.exports = sequelize;
