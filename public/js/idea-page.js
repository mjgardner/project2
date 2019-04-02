var $submitBtn = $("#submitUpdate");
var $editIdeaName = $("#edit-idea-name");
var $editIdeaDescription = $("#edit-idea-description");
var $editIdeaId = $("#edit-idea-id");
var $editIdeaModal = $("#edit-idea-modal");
var $deleteBtn = $("#delete-button");

var handleEditFormSubmit = function(event) {
  event.preventDefault();

  var project = {
    name: $editIdeaName.val().trim(),
    description: $editIdeaDescription.val().trim()
  };

  if (!(project.name && project.description)) {
    alert("You must enter a project name and description!");
    return;
  }

  $.ajax({
    headers: { "Content-Type": "application/json" },
    type: "PUT",
    url: "/api/projects/" + $editIdeaId.val(),
    data: JSON.stringify(project)
  }).then(function() {
    $editIdeaModal.modal("hide");
    window.location.reload();
  });
};

var handleDeleteBtnClick = function() {
  var idToDelete = $(this)
    .parent()
    .attr("data-id");
  console.log(idToDelete);
  $.ajax({
    url: "/api/projects/" + idToDelete,
    type: "DELETE"
  }).then(window.location.replace("/"));
  console.log("deleted");
};

$submitBtn.on("click", handleEditFormSubmit);
$deleteBtn.on("click", handleDeleteBtnClick);
