var db = require("../models");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    db.Project.findAll({}).then(function(dbProjects) {
      res.render("index", {
        msg: "Welcome!",
        projects: dbProjects
        /*variables needed for handlebars
        projects.name
        projects.description
        projects.pictureUrl
        projects.visits
        */
      });
    });
    db.Comment.findAll({}).then(function(dbComment) {
      res.render("index", {
        comments: dbComment
        /*variables needed for handlebars
        comments.text
        comments.rating
        comments.authorEmail
        */
      });
    });
  });

  // Load example page and pass in an example by id
  app.get("/project/:id", function(req, res) {
    db.Project.findOne({
      where: {
        id: req.params.id
      }
    }).then(function(dbProjects) {
      db.Comment.findOne({
        where: {
          id: req.params.id
        }
      }).then(function(dbComments) {
        console.log(dbComments);
        res.render("example", {
          projects: dbProjects,
          comments: dbComments
        });
      });
    });
  });

  //for later add search function and add Categories/Tags

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
    //for debug
    console.log("the page " + res);
  });
};
