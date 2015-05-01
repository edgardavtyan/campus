var HomeController = function() {
   var self = this;


   self.GET_index = function(req, res) {
      res.render('login');
   };

   self.GET_auth = function(req, res) {
      var apiData = {
         login: req.query().Username,
         password: req.query().Password
      };

      req.sendApi('GET', 'User/Auth', apiData, function(apiResponse) {
         res.send(200, 'text', apiResponse);
      });
   };
};

module.exports = HomeController;
