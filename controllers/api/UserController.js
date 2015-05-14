var UserAccountModel = require('../../models/UserAccount.js');

function HomeController() {
   var self = this;


   self.GET_auth = function(req, res) {
      UserAccountModel
         .find({ where: { Login: req.query().login } }, { raw: true })
         .then(function(users) {
            res.send(200, 'text', JSON.stringify(users, '', 4));
         });
   };
}

module.exports = new HomeController();
