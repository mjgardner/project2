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
      url: "/api/projects",
      data: JSON.stringify(example)
    });
  },
  get: function() {
    return $.ajax({
      url: "/api/projects",
      type: "GET"
    });
  },
  delete: function(id) {
    return $.ajax({
      url: "/api/projects/" + id,
      type: "DELETE"
    });
  }
};

// refreshPage gets new project idea's from the db and repopulates the list
var refreshPage = function() {
  API.get().then(function(data) {
    var newCardData = data[data.length - 1];

    var ideaCard = $("<div>");
    ideaCard.attr("id", "idea-card");
    ideaCard.attr("class", "card");
    ideaCard.attr("style", "width: 18rem");
    ideaCard.attr("data-id", newCardData.id);

    var ideaCardBody = $("<div>");
    ideaCardBody.attr("id", "idea-card-body");
    ideaCardBody.attr("class", "card-body");

    var ideaCardHeader = $("<h5>");
    ideaCardHeader.attr("id", "idea-card-title");
    ideaCardHeader.attr("class", "card-title");

    ideaCardHeader.append(
      "<a href='/project/" + newCardData.id + "'>" + newCardData.name + "</a>"
    );

    ideaCardBody.append(ideaCardHeader);
    ideaCardBody.append(
      // eslint-disable-next-line quotes
      '<p id="idea-card-text" class="card-text">' +
        newCardData.description +
        "</p>"
    );

    ideaCard.append(ideaCardBody);
    $ideaList.append(ideaCard);
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


// Add event listeners to the submit and delete buttons
$submitBtn.on("click", handleFormSubmit);
