function HomeController() {
   var self = this;


   self.GET_index = function(req, res) {
      res.render('index');
   };
}

module.exports = new HomeController();
