var HomeController = function() {
   var self = this;

   self.GET_index = function(req, res) {
      res.render('login');
   };

   self.GET_auth = function(req, res) {
      var apiUrl = 'http://campus-api.azurewebsites.net/User/Auth';
      var apiData = { login: req.query().Username, password: req.query().Password };
      console.log(apiData);
      req.send('GET', apiUrl, apiData, function(apiResponse) {
         res.send(200, 'text', apiResponse);
      });
   };
};

module.exports = HomeController;
