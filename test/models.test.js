var chai = require("chai");
var expect = chai.expect;
var db = require("../models");

var newProject;
var newProjectId;
describe("Project model", function() {
  it("should create a new project", function(done) {
    db.Project.create({
      name: "Project 1",
      description: "First project description"
    }).then(function(project) {
      expect(project).to.have.property("name");
      expect(project).to.have.property("description");
      expect(project).to.have.property("pictureUrl");
      expect(project).to.have.property("visits");
      expect(project).to.have.property("id");
      newProjectId = project.id;

      expect(project.name).to.equal("Project 1");
      expect(project.description).to.equal("First project description");
      expect(project.pictureUrl).to.be.an("undefined");
      expect(project.visits).to.equal(0);
      newProject = project;
      done();
    });
  });

  it("should update an existing project", function(done) {
    newProject.name = "Updated project 1";
    newProject.save().then(function(project) {
      expect(project).to.have.property("name");
      expect(project.name).to.equal("Updated project 1");
      done();
    });
  });
});

var newComment;
describe("Comment model", function() {
  it("should create a new comment", function(done) {
    db.Comment.create({
      ProjectId: newProjectId,
      text: "A pithy comment",
      rating: 5,
      authorEmail: "joe@example.com"
    }).then(function(comment) {
      expect(comment).to.have.property("ProjectId");
      expect(comment).to.have.property("text");
      expect(comment).to.have.property("rating");
      expect(comment).to.have.property("authorEmail");

      expect(comment.ProjectId).to.equal(newProjectId);
      expect(comment.text).to.equal("A pithy comment");
      expect(comment.rating).to.equal(5);
      expect(comment.authorEmail).to.equal("joe@example.com");
      newComment = comment;
      done();
    });
  });

  it("should update an existing comment", function(done) {
    newComment.text = "An entirely other pithy comment";
    newComment.save().then(function(comment) {
      expect(comment).to.have.property("text");
      expect(comment.text).to.equal("An entirely other pithy comment");
      done();
    });
  });

  it("should destroy an existing comment", function(done) {
    expect(function() {
      newComment.destroy();
    }).to.not.throw();
    done();
  });
});

describe("Project model redux", function() {
  it("should destroy an existing project", function(done) {
    expect(function() {
      newProject.destroy();
    });
    done();
  });
});
