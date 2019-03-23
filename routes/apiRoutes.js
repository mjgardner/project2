var db = require("../models");

module.exports = function(app) {
  // Get all project ideas along with their average rating from comments
  app.get("/api/projects", function(req, res) {
    db.Project.findAll({
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
    }).then(function(dbProjects) {
      res.json(dbProjects);
    });
  });

  // Get a single project idea along with its average rating from comments
  app.get("/api/projects/:id", function(req, res) {
    db.Project.findOne({
      where: {
        id: req.params.id
      },
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
    }).then(function(project) {
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
      where: {
        ProjectId: req.params.id
      }
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
