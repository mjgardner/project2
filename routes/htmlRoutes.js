var db = require("../models");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    db.Project.findAll({}).then(function(dbProjects) {
      res.render("index", {
        /*        ^this should be changed
         with the new handlebars page form mooney when done :|
         */
        pageTitle: "Ideas R Us",
        projects: dbProjects
        /*variables needed by projects for handlebars
        projects.name
        projects.description
        projects.pictureUrl
        projects.visits
        */
      });
    });
  });
  //send the comments section
  //Load example page and pass in a Project and comments by id ;)
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
        // console.log(dbComments);
        res.render("example", {
          /*         ^this should be changed
            with the new handlebars page form mooney when done :|
            variables needed by comments for handlebars
            comments.text
            comments.rating
            comments.authorEmail
         */
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
    // console.log("the page " + res);
  });
};
