var db = require('../core/db');
var Sequelize = require('sequelize');

var UserAccount = db.define('UserAccount', {
   UserAccountId: {
      type: Sequelize.INTEGER(),
      primaryKey: true,
      allowNull: false,
   },

   Login: {
      type: Sequelize.STRING(50),
      allowNull: false
   },

   Password: {
      type: Sequelize.STRING(1000000000),
      allowNull: false
   },

   Email: {
      type: Sequelize.STRING(100),
      allowNull: true
   },

   NewPassword: {
      type: Sequelize.STRING(1000000000),
      allowNull: true
   },

   Cookie: {
      type: Sequelize.CHAR(26),
      allowNull: true
   },

   FullName: {
      type: Sequelize.STRING(100),
      allowNull: true
   },

   ScientificInterest: {
      type: Sequelize.STRING(1000000000),
      allowNull: true
   },

   CodeAssembly: {
      type: Sequelize.CHAR(10),
      allowNull: true
   },

   vcActuality: {
      type: Sequelize.CHAR(1),
      allowNull: false
   },

   vcChangeDate: {
      type: Sequelize.DATE(),
      allowNull: false
   },

   FullNameEng: {
      type: Sequelize.STRING(64),
      allowNull: true
   },

   IsConfirmed: {
      type: Sequelize.CHAR(1),
      allowNull: true
   },

   ReasonFailure: {
      type: Sequelize.STRING(1000000000),
      allowNull: true
   },

   Credo: {
      type: Sequelize.STRING(1000000000),
      allowNull: true
   },

   PublishURL: {
      type: Sequelize.STRING(50),
      allowNull: true
   }
},
{
   freezeTableName: true,
   timestamps: false
});

module.exports = UserAccount;
