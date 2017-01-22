$(document).ready(function(){
  submitForm();

});

function submitForm() {
  $("form").on('submit', function(event){
    var repoName = $("#repoName").val();
    var repoOwner = $("#repoOwner").val();
    var title = $("#title").val();
    var body = $("#body").val();

    createIssue(repoName, repoOwner, title, body);
    event.preventDefault();
  });
}


function GithubInteractor(token) {
  this.token = token;
}


function createIssue(repoName, repoOwner, title, body) {

  var interactor = new GithubInteractor("4c50232161bae4f0ad3de8486b119dcbea388db9");
  var url = "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/issues";
  var data = {
    title: title,
    body: body
  };
  alert(url);

  $.ajax({
    url: url,
    type: 'POST',
    headers: {
      Authorization: "token 4c50232161bae4f0ad3de8486b119dcbea388db9"
    },
    data: JSON.stringify(data),
    dataType: 'json'
  }).done(handleResponse)
  .fail(handleError);
}

function handleResponse(data) {
  var outhtml = '<a href="' + data.html_url +'">' + data.title + '</a><br>';
  $('#issue').html(outhtml);

}
function handleError(xhr, status, error) {
  $('#issue').html("Post error: " + error)
}