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
      console.log("created project " + result.id);
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
      });
  });
});
