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
  // Get all project ideas along with their average rating from comments,
  // optionally with a q query parameter to search names and descriptions
  app.get("/api/projects", function(req, res) {
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
      res.json(dbProjects);
    });
  });

  // Get a single project idea along with its average rating from comments
  app.get("/api/projects/:id", function(req, res) {
    var findOneParams = Object.assign({}, findDefaults);
    findOneParams.where = { id: req.params.id };
    db.Project.findOne(findOneParams).then(function(project) {
      if (project) {
        res.json(project);
      } else {
        res.sendStatus(404);
      }
    });
  });

  // Get a project idea's comments
  app.get("/api/projects/:id/comments", function(req, res) {
    db.Comment.findAll({
      where: { ProjectId: req.params.id }
    }).then(function(comments) {
      res.json(comments);
    });
  });

  // Get a single comment
  app.get("/api/comments/:id", function(req, res) {
    db.Comment.findByPk(req.params.id).then(function(comment) {
      if (comment) {
        res.json(comment);
      } else {
        res.sendStatus(404);
      }
    });
  });

  // Create a new project idea
  app.post("/api/projects", function(req, res) {
    db.Project.create({
      name: req.body.name,
      description: req.body.description,
      pictureUrl: req.body.pictureUrl
    }).then(function(project) {
      res.json({ id: project.id });
    });
  });

  // Create a new comment/rating
  app.post("/api/projects/:id/comments", function(req, res) {
    db.Comment.create({
      text: req.body.text,
      rating: req.body.rating,
      authorEmail: req.body.authorEmail,
      ProjectId: req.params.id
    }).then(function(comment) {
      res.json({ id: comment.id });
    });
  });

  // Edit (update) a project idea
  app.put("/api/projects/:id", function(req, res) {
    db.Project.update(
      {
        name: req.body.name,
        description: req.body.description,
        pictureUrl: req.body.pictureUrl
      },
      {
        where: {
          id: req.params.id
        }
      }
    ).then(function(results) {
      if (results[0]) {
        res.sendStatus(204);
      } else {
        res.sendStatus(404);
      }
    });
  });

  // Delete a project idea
  app.delete("/api/projects/:id", function(req, res) {
    db.Project.destroy({ where: { id: req.params.id } }).then(function() {
      res.sendStatus(204);
    });
  });
};
