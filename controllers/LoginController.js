var HomeController = function() {
   var self = this;

   self.GET_index = function(req, res) {
      res.render('login');
   };
};

module.exports = HomeController;
