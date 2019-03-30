var db = require("../models");
/* eslint-env es6 */
const Op = db.Sequelize.Op;

var findDefaults = {
  group: ["Project.id"],
  attributes: [
    "id",
    "name",
    "description",
    "pictureUrl",
    "visits",
    [
      db.sequelize.fn("AVG", db.sequelize.col("Comments.rating")),
      "averageRating"
    ]
  ],
  include: [
    {
      model: db.Comment,
      attributes: []
    }
  ]
};

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    var findAllParams = Object.assign({}, findDefaults);
    if (req.query.q) {
      findAllParams.where = {
        [Op.or]: [
          { name: { [Op.like]: "%" + req.query.q + "%" } },
          { description: { [Op.like]: "%" + req.query.q + "%" } }
        ]
      };
    }
    db.Project.findAll(findAllParams).then(function(dbProjects) {
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

  app.get("/test/:id", function(req, res) {
    res.render("example", {});
  });
  //send the comments section
  //Load example page and pass in a Project and comments by id ;)
  app.get("/project/:id", function(req, res) {
    db.Project.findOne({
      where: {
        id: req.params.id
      }
    }).then(function(dbProjects) {
      res.render("idea-page", {
        /*         ^this should be changed
        with the new handlebars page form mooney when done :|
     */
        projects: dbProjects
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
