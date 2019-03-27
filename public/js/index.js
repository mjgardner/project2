// Get references to page elements
var newIdeaName = $("#new-idea-name");
var $newIdeaDescription = $("#new-idea-description");
var $submitBtn = $("#submit");
var $ideaList = $("#idea-list");

// The API object contains methods for each kind of request we'll make
var API = {
  save: function(example) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "api/projects",
      data: JSON.stringify(example)
    });
  },
  get: function() {
    return $.ajax({
      url: "api/projects",
      type: "GET"
    });
  },
  delete: function(id) {
    return $.ajax({
      url: "api/projects/" + id,
      type: "DELETE"
    });
  }
};

// refreshPage gets new project idea's from the db and repopulates the list
var refreshPage = function() {
  API.get().then(function(data) {
    var $projectList = data.map(function(project) {
      var $a = $("<a>")
        .text(project.name)
        .attr("href", "/projects/" + project.id);

      var $li = $("<li>")
        .attr({
          class: "list-group-item",
          "data-id": project.id
        })
        .append($a);

      var $button = $("<button>")
        .addClass("btn btn-danger float-right delete")
        .text("ｘ");

      $li.append($button);

      return $li;
    });

    $ideaList.empty();
    $ideaList.append($projectList);
  });
};

// handleFormSubmit is called whenever we submit a new example
// Save the new example to the db and refresh the list
var handleFormSubmit = function(event) {
  event.preventDefault();

  var example = {
    name: newIdeaName.val().trim(),
    description: $newIdeaDescription.val().trim()
  };

  if (!(example.name && example.description)) {
    alert("You must enter an example name and description!");
    return;
  }

  API.save(example).then(function() {
    refreshPage();
  });

  newIdeaName.val("");
  $newIdeaDescription.val("");
};

// handleDeleteBtnClick is called when an example's delete button is clicked
// Remove the example from the db and refresh the list
var handleDeleteBtnClick = function() {
  var idToDelete = $(this)
    .parent()
    .attr("data-id");

  API.delete(idToDelete).then(function() {
    refreshPage();
  });
};

// Add event listeners to the submit and delete buttons
$submitBtn.on("click", handleFormSubmit);
$ideaList.on("click", ".delete", handleDeleteBtnClick);
