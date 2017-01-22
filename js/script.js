"use strict";



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

  var interactor = new GithubInteractor("4333529981aef08bb8b1c9793593cedd415c7848");
  var url = "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/issues";
  var data = {
    title: title,
    body: body
  };
//  alert(url);

  $.ajax({
    url: url,
    type: 'POST',
    beforeSend: function(xhr) {
      xhr.setRequestHeader("Authorization", "token " + interactor.token);
    },
    data: JSON.stringify(data),
  //  dataType: 'json'
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
$(document).ready(function(){
  submitForm();

});
