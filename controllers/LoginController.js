var HomeController = function() {
   var self = this;

   self.GET_index = function() {
      self.response.render('login');
   };
};

module.exports = HomeController;
