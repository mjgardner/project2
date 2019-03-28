var chai = require("chai");
var expect = chai.expect;
chai.use(require("chai-http"));

var app = require("../server");
var db = require("../models");

before(function(done) {
  app.on("serverStarted", function() {
    done();
  });
});

describe("API endpoint /api/projects", function() {
  this.timeout(5000);

  before(function() {
    db.Project.create({
      name: "Project 1",
      description: "Description of the project"
    }).then(function(result) {
      db.Comment.create({
        ProjectId: result.id,
        text: "A pithy comment",
        rating: 5,
        authorEmail: "joe@example.com"
      });
      db.Comment.create({
        ProjectId: result.id,
        rating: 4
      });
    });
  });

  after(function() {
    db.Project.destroy({ where: { id: 1 } });
  });

  it("should return all projects", function() {
    return chai
      .request(app)
      .get("/api/projects")
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an("array");
      });
  });

  it("should return project info", function() {
    return chai
      .request(app)
      .get("/api/projects/1")
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an("object");

        var project = res.body;
        expect(project).to.have.property("name");
        expect(project).to.have.property("description");
        expect(project).to.have.property("pictureUrl");
        expect(project).to.have.property("visits");
        expect(project).to.have.property("averageRating");

        expect(project.name).to.equal("Project 1");
        expect(project.description).to.equal("Description of the project");
        expect(parseFloat(project.averageRating)).to.equal(4.5);
      });
  });

  it("should fail to return a nonexistent project", function() {
    return chai
      .request(app)
      .get("/api/projects/2")
      .then(function(res) {
        expect(res).to.have.status(404);
      });
  });

  it("should return matching projects", function() {
    return chai
      .request(app)
      .get("/api/projects?q=Description")
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an("array");

        var projects = res.body;
        expect(projects[0].name).to.equal("Project 1");
      });
  });

  it("should return comments", function() {
    return chai
      .request(app)
      .get("/api/projects/1/comments")
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an("array");
        expect(res.body).to.have.lengthOf(2);
      });
  });

  it("should return an individual comment", function() {
    return chai
      .request(app)
      .get("/api/comments/1")
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an("object");

        var comment = res.body;
        expect(comment).to.have.property("ProjectId");
        expect(comment).to.have.property("text");
        expect(comment).to.have.property("rating");
        expect(comment).to.have.property("authorEmail");

        expect(comment.ProjectId).to.equal(1);
        expect(comment.text).to.equal("A pithy comment");
        expect(comment.rating).to.equal(5);
        expect(comment.authorEmail).to.equal("joe@example.com");
      });
  });

  var newProjectId;
  it("should create a new project", function() {
    return chai
      .request(app)
      .post("/api/projects")
      .type("form")
      .send({
        name: "Project 2",
        description: "A second project"
      })
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("id");
        newProjectId = res.body.id;
      });
  });

  it("should create a new comment/rating", function() {
    return chai
      .request(app)
      .post("/api/projects/" + newProjectId + "/comments")
      .type("form")
      .send({
        ProjectId: newProjectId,
        text: "Comment on second project",
        rating: 3,
        authorEmail: "jill@example.com"
      })
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("id");
      });
  });

  it("should update a project", function() {
    return chai
      .request(app)
      .put("/api/projects/" + newProjectId)
      .send({
        name: "An edited project name",
        description: "An edited description"
      })
      .then(function(res) {
        expect(res).to.have.status(204);
      });
  });

  it("should fail to update a nonexistent project", function() {
    return chai
      .request(app)
      .put("/api/projects/3")
      .send({
        name: "An edited project name",
        description: "An edited description"
      })
      .then(function(res) {
        expect(res).to.have.status(404);
      });
  });

  it("should delete a project", function() {
    return chai
      .request(app)
      .delete("/api/projects/" + newProjectId)
      .then(function(res) {
        expect(res).to.have.status(204);
      });
  });
});
