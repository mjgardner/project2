var $submitBtn = $("#submitUpdate");
var $editIdeaName = $("#edit-idea-name");
var $editIdeaDescription = $("#edit-idea-description");
var $editIdeaId = $("#edit-idea-id");
var $editIdeaModal = $("#edit-idea-modal");

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

$submitBtn.on("click", handleEditFormSubmit);
